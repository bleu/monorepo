import { TransactionProgressBar } from "#/app/milkman/(components)/orderForm/TransactionProgressBar";
import { TransactionStatus } from "#/app/milkman/utils/type";
import { Button } from "#/components";

export function FormFooter({
  transactionStatus,
  onClick,
  disabled = false,
}: {
  transactionStatus: TransactionStatus;
  onClick?: () => void;
  disabled?: boolean;
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
            <Button type="button" className="w-full" color="slate" disabled>
              <span>Add one more order</span>
            </Button>
            <Button type="submit" className="w-full" onClick={onClick}>
              <span>Build transaction</span>
            </Button>
          </>
        ) : (
          <Button
            type="submit"
            className="w-full"
            onClick={onClick}
            disabled={disabled}
          >
            <span>Continue</span>
          </Button>
        )}
      </div>
    </div>
  );
}
