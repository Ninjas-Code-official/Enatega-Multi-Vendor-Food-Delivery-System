'use client';

// GraphQL Query
import { GET_RIDER } from '@/lib/api/graphql';

// Hooks
import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

// Interfaces
import { IQueryResult, IRiderDetailDataResponse } from '@/lib/utils/interfaces';

// UI Components
import BankDetails from '@/lib/ui/screen-components/protected/super-admin/riders/view/cards/bank-details';
import LicenseDetails from '@/lib/ui/screen-components/protected/super-admin/riders/view/cards/license-details';
import PersonalDetails from '@/lib/ui/screen-components/protected/super-admin/riders/view/cards/personal-details';
import VehicleDetails from '@/lib/ui/screen-components/protected/super-admin/riders/view/cards/vehicle-details';
import HeaderText from '@/lib/ui/useable-components/header-text';

export default function RidersDetailScreen() {
  // Hooks
  const t = useTranslations();
  const { id } = useParams();

  // Query
  const { data, loading } = useQueryGQL(
    GET_RIDER,
    {
      id: id.toString(),
    },
    {
      fetchPolicy: 'cache-and-network',
    }
  ) as IQueryResult<IRiderDetailDataResponse | undefined, undefined>;

  // Variables
  let rider = data?.rider;

  return (
    <div className="screen-container p-3">
      <HeaderText className="heading" text={t('Rider Information')} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
        {/* top-left */}
        <PersonalDetails loading={loading} rider={rider} />
        {/* top-right */}
        <BankDetails loading={loading} rider={rider} />
        {/* bottom-left */}
        <LicenseDetails loading={loading} rider={rider} />
        {/* bottom-right */}
        <VehicleDetails loading={loading} rider={rider} />
      </div>
    </div>
  );
}
