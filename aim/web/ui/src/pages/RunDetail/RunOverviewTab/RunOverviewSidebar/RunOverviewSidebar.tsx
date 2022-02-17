import React from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';
import moment from 'moment';

import { Divider } from '@material-ui/core';

import { Badge, Icon, Text } from 'components/kit';

import { processDurationTime } from 'utils/processDurationTime';

import { IRunOverviewSidebarProps } from './RunOverviewSidebar.d';

import './RunOverviewSidebar.scss';

function RunOverviewSidebar({
  info,
  traces,
  systemBatchLength,
}: IRunOverviewSidebarProps) {
  const { url } = useRouteMatch();

  const insightsList = React.useMemo(() => {
    const path = url.split('/').slice(0, -1).join('/');
    return [
      {
        name: 'Metrics',
        path: `${path}/metrics`,
        value: traces?.metric?.length || 0,
      },
      {
        name: 'System',
        path: `${path}/system`,
        value: systemBatchLength || 0,
      },
      {
        name: 'Distributions',
        path: `${path}/distributions`,
        value: traces?.distributions?.length || 0,
      },
      {
        name: 'Images',
        path: `${path}/images`,
        value: traces?.images?.length || 0,
      },
      {
        name: 'Audios',
        path: `${path}/audios`,
        value: traces?.audios?.length || 0,
      },
      {
        name: 'Texts',
        path: `${path}/texts`,
        value: traces?.texts?.length || 0,
      },
      {
        name: 'Figures',
        path: `${path}/figures`,
        value: traces?.figures?.length || 0,
      },
    ];
  }, [traces]);

  return (
    <div className='RunOverviewSidebar'>
      <div className='RunOverviewSidebar__section RunOverviewSidebar__section__info'>
        <Text weight={600} size={18} tint={100} component='h3'>
          Information
        </Text>
        <div>
          <Icon name='tags' />
          <Text tint={70}>
            {`${moment(info?.creation_time * 1000).format('DD MMMM YYYY')}`}
          </Text>
        </div>
        <div>
          <Icon name='tags' />
          <Text tint={70}>
            {`${moment(info?.creation_time * 1000).format('HH:MM A')}`}
          </Text>
        </div>
        <div>
          <Icon name='tags' />
          <Text tint={70}>
            {processDurationTime(
              info?.creation_time * 1000,
              info?.end_time ? info?.end_time * 1000 : Date.now(),
            )}
          </Text>
        </div>
        <div>
          <Icon name='tags' />
          <Text tint={70}>{info.name.split(':')[1]}</Text>
        </div>
      </div>
      <div className='RunOverviewSidebar__section RunOverviewSidebar__section__tags'>
        <Text weight={600} size={18} tint={100} component='h3'>
          Tags{' '}
          <Text component='span' tint={70} weight={600} size={18}>
            ({info.tags.length})
          </Text>
        </Text>
        <div className='RunOverviewSidebar__section__tags-list'>
          {/*{info.tags.length ? (*/}
          {/*  info.tags.map((tag) => {*/}
          {/*    return (*/}
          {/*      <Badge color={tag.color} label={tag.name} key={tag.name} />*/}
          {/*    );*/}
          {/*  })*/}
          {/*) : (*/}
          {/*  <Text size={14} tint={70}>*/}
          {/*    No Tags*/}
          {/*  </Text>*/}
          {/*)}*/}
          <Badge label='tag1' />
          <Badge label='tag1' />
          <Badge label='tag1' />
          <Badge label='tag1' />
        </div>
      </div>
      <Divider className='RunOverviewSidebar__section__Divider' />
      <div className='RunOverviewSidebar__section RunOverviewSidebar__section__insights'>
        <Text weight={600} size={18} tint={100} component='h3'>
          Insights
        </Text>
        <div>
          {insightsList.map(({ name, path, value }) => {
            return (
              <NavLink
                className='RunOverviewSidebar__NavLink'
                key={path}
                to={path}
              >
                <Text size={14}>{name}</Text> <Text size={14}>{value}</Text>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default React.memo(RunOverviewSidebar);
