import json
from typing import Optional, Dict, List

from fastapi import HTTPException
from pydantic import BaseModel
from starlette.responses import StreamingResponse

from aim import Images, Texts, Distributions, Audios, Figures
from aim.sdk.sequence import Sequence
from aim.web.api.runs.pydantic_models import (
    RunTracesBatchApiIn,
    URIBatchIn,
    QuerySyntaxErrorOut,
    ImageList,
    TextList,
    AudioList,
    DistributionInfo,
    FigureInfo,
    ObjectSearchRunView,
    ObjectSequenceBaseView,
)
from aim.web.api.runs.utils import get_project_repo, checked_query, checked_range, numpy_to_encodable
from aim.web.api.runs.object_api_utils import CustomObjectApi, get_blobs_batch


class CustomObjectApiConfig:
    sequence_type: type = Sequence
    resolve_blobs: bool = False
    dump_record_fn: callable = lambda x: x.data  # noqa E731
    model: type = BaseModel

    @classmethod
    def register_endpoints(cls, router):
        assert issubclass(cls.sequence_type, Sequence)
        seq_name = cls.sequence_type.sequence_name()

        # search API
        search_endpoint = f'/search/{seq_name}/'

        @router.get(search_endpoint, response_model=Dict[str, ObjectSearchRunView],
                    responses={400: {'model': QuerySyntaxErrorOut}})
        async def search_api(q: Optional[str] = '',
                             record_range: Optional[str] = '', record_density: Optional[int] = 50,
                             index_range: Optional[str] = '', index_density: Optional[int] = 5):
            # search Sequence API
            repo = get_project_repo()
            query = checked_query(q)
            record_range = checked_range(record_range)
            index_range = checked_range(index_range)

            traces = repo.query_images(query=query)
            api = CustomObjectApi(seq_name, resolve_blobs=cls.resolve_blobs)
            api.set_trace_collection(traces)
            api.set_ranges(record_range, record_density, index_range, index_density)
            streamer = api.search_result_streamer()
            return StreamingResponse(streamer)

        # run sequence batch API
        sequence_batch_endpoint = f'/{{run_id}}/{seq_name}/get-batch/'

        @router.post(sequence_batch_endpoint, response_model=List[ObjectSequenceBaseView])
        async def sequence_batch_api(run_id: str,
                                     requested_traces: RunTracesBatchApiIn,
                                     record_range: Optional[str] = '', record_density: Optional[int] = 50,
                                     index_range: Optional[str] = '', index_density: Optional[int] = 5):
            # get Sequence batch API
            repo = get_project_repo()
            record_range = checked_range(record_range)
            index_range = checked_range(index_range)

            run = repo.get_run(run_id)
            if not run:
                raise HTTPException(status_code=404)

            api = CustomObjectApi(seq_name, resolve_blobs=cls.resolve_blobs)
            api.set_dump_data_fn(cls.dump_record_fn)
            api.set_requested_traces(run, requested_traces)
            api.set_ranges(record_range, record_density, index_range, index_density)
            traces_streamer = api.requested_traces_streamer()
            return StreamingResponse(traces_streamer)

        if not cls.resolve_blobs:
            # get BLOB batch API
            uri_batch_endpoint = f'/{seq_name}/get-batch'

            @router.post(uri_batch_endpoint)
            def blobs_batch_api(uri_batch: URIBatchIn):
                return StreamingResponse(get_blobs_batch(uri_batch, get_project_repo()))


class ImageApiConfig(CustomObjectApiConfig):
    sequence_type = Images
    resolve_blobs = False
    model = ImageList


class TextApiConfig(CustomObjectApiConfig):
    sequence_type = Texts
    resolve_blobs = True
    model = TextList


class DistributionApiConfig(CustomObjectApiConfig):
    sequence_type = Distributions
    resolve_blobs = True
    dump_record_fn = lambda x: numpy_to_encodable(x.weights)  # noqa E731
    model = DistributionInfo


class AudioApiConfig(CustomObjectApiConfig):
    sequence_type = Audios
    resolve_blobs = False
    model = AudioList


class FigureApiConfig(CustomObjectApiConfig):
    sequence_type = Figures
    resolve_blobs = True
    dump_record_fn = lambda x: json.loads(x.data)  # noqa E731
    model = FigureInfo
