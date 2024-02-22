import { TransactionProgressBar } from "#/app/amms/(components)/SingleOrderForm/TransactionProgressBar";
import { TransactionStatus } from "#/app/amms/utils/type";
import { Button } from "#/components";
import { Spinner } from "#/components/Spinner";

export function FormFooter({
  transactionStatus,
  onContinue,
  onAddOneMore,
  disabled = false,
  isLoading = false,
  continueButtonType = "submit",
}: {
  transactionStatus: TransactionStatus;
  onContinue?: () => void;
  onAddOneMore?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  continueButtonType?: "submit" | "button" | "reset";
}) {
  const isDraftResume = transactionStatus === TransactionStatus.ORDER_SUMMARY;
  return (
    <div className="flex flex-col gap-y-5">
      {!isDraftResume && (
        <TransactionProgressBar
          currentStageName={transactionStatus}
          totalSteps={3}
        />
      )}
      <div className="flex justify-center gap-x-5">
        {isDraftResume ? (
          <>
            <Button
              type="button"
              className="w-full"
              color="slate"
              onClick={onAddOneMore}
            >
              <span>Add one more order</span>
            </Button>
            <Button
              type={continueButtonType}
              className="w-full"
              onClick={onContinue}
              disabled={disabled || isLoading}
            >
              {isLoading ? (
                <Spinner size="sm" />
              ) : (
                <span>Build transaction</span>
              )}
            </Button>
          </>
        ) : (
          <Button
            type={continueButtonType}
            className="w-full"
            onClick={onContinue}
            disabled={disabled || isLoading}
          >
            {isLoading ? <Spinner size="sm" /> : <span>Continue</span>}
          </Button>
        )}
      </div>
    </div>
  );
}
