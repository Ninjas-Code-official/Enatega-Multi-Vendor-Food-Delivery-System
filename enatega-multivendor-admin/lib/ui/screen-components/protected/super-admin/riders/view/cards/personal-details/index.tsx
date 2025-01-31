// Interfaces
import { IRiderDetailsProps } from '@/lib/utils/interfaces';

// PrimeReact Components
import { Skeleton } from 'primereact/skeleton';

// Localization
import { useTranslations } from 'next-intl';

const PersonalDetails = ({ loading, rider }: IRiderDetailsProps) => {
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-2 border rounded-lg overflow-hidden">
      <header className="bg-[#F4F4F5] px-6 py-3 border-b-[1px] text-lg font-medium">
        {t('Rider Information')}
      </header>

      {/* columns */}
      <div className="grid grid-cols-2 py-5 px-6">
        {/* left-column */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <span className="text-xs">{t('Full Name')}</span>
            <span className="font-medium">
              {loading ? <Skeleton height="1.5rem" /> : (rider?.name ?? '-')}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs">{t('Email')}</span>
            <span className="font-medium">
              {loading ? <Skeleton height="1.5rem" /> : (rider?.email ?? '-')}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs">{t('Zone')}</span>
            <span className="font-medium ">
              {loading ? (
                <Skeleton height="1.5rem" />
              ) : (
                (rider?.zone.title ?? '-')
              )}
            </span>
          </div>
        </div>

        {/* right-column */}
        <div className="flex pl-5 flex-col gap-5">
          <div className="flex flex-col gap-1">
            <span className="text-xs">{t('Phone')}</span>
            <span className="font-medium">
              {loading ? <Skeleton height="1.5rem" /> : (rider?.phone ?? '-')}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs">{t('Password')}</span>
            <span className="font-medium">
              {loading ? (
                <Skeleton height="1.5rem" />
              ) : (
                (rider?.password ?? '-')
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
