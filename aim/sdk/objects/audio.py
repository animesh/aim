import io
import logging

from aim.sdk.num_utils import inst_has_typename
from aim.sdk.objects.io import wavfile
from aim.storage.object import CustomObject
from aim.storage.types import BLOB

logger = logging.getLogger(__name__)


@CustomObject.alias('aim.audio')
class Audio(CustomObject):
    AIM_NAME = 'aim.audio'

    # supported audio formats
    UNKNOWN = ''
    MP3 = 'mp3'
    WAV = 'wav'
    FLAC = 'flac'

    audio_formats = (MP3, WAV, FLAC)

    def __init__(self, data, **kwargs):
        super().__init__()

        caption = kwargs.get('caption', '')
        rate = kwargs.get('rate', 22050)
        audio_format = kwargs.get('format', self.UNKNOWN).lower()

        if inst_has_typename(data, ['ndarray.numpy']):
            # Currently, only WAV audio formats are supported for numpy
            audio_format = self.WAV
            if 'rate' not in kwargs:
                logger.warning(f'Parameter "rate" is not provided! Using default: {rate}')
            bs = wavfile.write(rate, data)
            data = bs
        else:
            # act as a regular file with enforced audio format definition by user side
            if not audio_format:
                raise ValueError('Audio format must be provided.')
            if audio_format not in self.audio_formats:
                raise ValueError('Invalid audio format is provided.')

        if not isinstance(data, io.BytesIO):
            raise TypeError('Content is not a byte-stream object')

        self._prepare(data, caption=caption, format=audio_format)

    def _prepare(self, buffer, **extra):
        assert isinstance(buffer, io.BytesIO)

        for k, v in extra.items():
            self.storage[k] = v
        self.storage['source'] = 'audio'
        self.storage['data'] = BLOB(data=buffer.read())

    def to_numpy(self):
        """
        This method converts WAV to Numpy array.
        Other audio formats are not supported at this moment.
        """
        assert self.storage['format'] == self.__audio_format_map[self.WAV]

        return wavfile.read(self.get())

    def get(self) -> io.BytesIO:
        bs = self.storage.get('bytes')
        if not bs:
            return io.BytesIO()
        return io.BytesIO(bytes(bs))
