// Interfaces
import { IRiderDetailsProps } from '@/lib/utils/interfaces';

// PrimeReact Components
import { Skeleton } from 'primereact/skeleton';

// Localization
import { useTranslations } from 'next-intl';

const BankDetails = ({ loading, rider }: IRiderDetailsProps) => {
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-2 border rounded-lg overflow-hidden">
      <header className="bg-[#F4F4F5] px-6 py-3 border-b-[1px] text-lg font-medium">
        {t('Bank Details')}
      </header>

      {/* columns */}
      <div className="grid grid-cols-2 py-5 px-6">
        {/* left-column */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <span className="text-xs">{t('Bank Name')}</span>
            <span className="font-medium">
              {loading ? (
                <Skeleton height="1.5rem" />
              ) : (
                (rider?.bussinessDetails?.bankName ?? '-')
              )}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs">{t('Account Name')}</span>
            <span className="font-medium">
              {loading ? (
                <Skeleton height="1.5rem" />
              ) : (
                (rider?.bussinessDetails?.accountName ?? '-')
              )}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs">{t('BSB / IBAN / Swift Code')}</span>
            <span className="font-medium ">
              {loading ? (
                <Skeleton height="1.5rem" />
              ) : (
                (rider?.bussinessDetails?.accountCode ?? '-')
              )}
            </span>
          </div>
        </div>

        {/* right-column */}
        <div className="flex pl-5 flex-col gap-5">
          <div className="flex flex-col gap-1">
            <span className="text-xs">{t('Account Name')}</span>
            <span className="font-medium">
              {loading ? (
                <Skeleton height="1.5rem" />
              ) : (
                (rider?.bussinessDetails?.accountName ?? '-')
              )}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs">{t('Account No')}</span>
            <span className="font-medium">
              {loading ? (
                <Skeleton height="1.5rem" />
              ) : (
                (rider?.bussinessDetails?.accountNumber ?? '-')
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankDetails;
