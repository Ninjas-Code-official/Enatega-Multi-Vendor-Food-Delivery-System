// Interfaces
import { IRiderDetailsProps } from '@/lib/utils/interfaces';

// PrimeReact Components
import { Skeleton } from 'primereact/skeleton';

// Localization
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const VehicleDetails = ({ loading, rider }: IRiderDetailsProps) => {
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-2 border rounded-lg overflow-hidden">
      <header className="bg-[#F4F4F5] px-6 py-3 border-b-[1px] text-lg font-medium">
        {t('Vehicle Details')}
      </header>

      {/* columns */}
      <div className="grid grid-cols-2 h-full py-5 px-6">
        {/* left-column */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <span className="text-xs">{t('Vehicle Plate Number')}</span>
            <span className="font-medium">
              {loading ? (
                <Skeleton height="1.5rem" />
              ) : (
                (rider?.vehicleDetails.number ?? '-')
              )}
            </span>
          </div>
        </div>

        {/* right-column */}
        <div className="flex flex-col gap-5">
          {loading ? (
            <div className="pl-5 h-full flex items-center">
              <Skeleton width="100%" height="100%" />
            </div>
          ) : rider?.licenseDetails?.image ? (
            <div className="relative aspect-video">
              <Image
                fill
                src={
                  rider?.licenseDetails?.image?.startsWith('http') // Check if it's an absolute URL
                    ? rider?.licenseDetails?.image
                    : `https://static.vecteezy.com/system/resources/previews/031/602/489/large_2x/blank-license-plate-icon-design-templates-free-vector.jpg` // Add the base URL if it's a relative path
                }
                alt="license image"
                objectFit="cover"
              />
            </div>
          ) : (
            <span>-</span> // Updated from string to span for better semantics
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
