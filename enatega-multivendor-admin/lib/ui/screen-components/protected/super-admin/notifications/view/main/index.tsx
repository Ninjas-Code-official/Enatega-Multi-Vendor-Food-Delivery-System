//Prime react
import { FilterMatchMode } from 'primereact/api';

//Hooks
import { ChangeEvent, useState } from 'react';

//Components
import NotificationTableHeader from '../header/table-header';
import Table from '@/lib/ui/useable-components/table';

// Constants
import { generateDummyNotifications } from '@/lib/utils/dummy';
import { NOTIFICATIONS_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/notification-columns';

// GraphQL

// Interfaces
import { IQueryResult } from '@/lib/utils/interfaces';
import { IGetNotifications } from '@/lib/utils/interfaces/notification.interface';
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import { GET_NOTIFICATIONS } from '@/lib/api/graphql';

export default function NotificationMain() {
  const { data: notificationData, loading: notificationLoading } = useQueryGQL(
    GET_NOTIFICATIONS,
    {}
  ) as IQueryResult<IGetNotifications | undefined, undefined>;

  // States
  const [selectedActions, setSelectedActions] = useState<string[]>([]);

  // Filters
  const [filters, setFilters] = useState({
    global: { value: '', matchMode: FilterMatchMode.CONTAINS },
  });

  const [globalFilterValue, setGlobalFilterValue] = useState('');

  // Global filters change
  const onGlobalFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters };

    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  return (
    <div className="p-3">
      <Table
        columns={NOTIFICATIONS_TABLE_COLUMNS()}
        data={notificationData?.notifications ?? generateDummyNotifications()}
        selectedData={[]}
        setSelectedData={() => {}}
        header={
          <NotificationTableHeader
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={onGlobalFilterChange}
            selectedActions={selectedActions}
            setSelectedActions={setSelectedActions}
          />
        }
        loading={notificationLoading}
        filters={filters}
      />
    </div>
  );
}
