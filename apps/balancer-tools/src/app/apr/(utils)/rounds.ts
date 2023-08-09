
export class Round {
    private static FIRST_ROUND_END_DATE = new Date("2022-04-13T23:59:59.999Z");
    private static ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

    endDate: Date;
    value: string;
    activeRound: boolean;

    constructor(endDate: Date, roundNumber: number, active: boolean) {
      this.endDate = endDate;
      this.value = String(roundNumber);
      this.activeRound = active;
    }

    get label(): string {
      return this.endDate.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }

    static getRoundTimestamp(roundNumber: number): number {
      return Round.FIRST_ROUND_END_DATE.getTime() + (roundNumber - 1) * Round.ONE_WEEK_IN_MS;
    }

    static getAllRounds(): Round[] {
      const roundsCount =
        Math.ceil((Date.now() - Round.FIRST_ROUND_END_DATE.getTime()) / Round.ONE_WEEK_IN_MS) + 1;

      return Array.from({ length: roundsCount }, (_, i) => {
        const endDate = new Date(Round.FIRST_ROUND_END_DATE.getTime() + i * Round.ONE_WEEK_IN_MS);
        return new Round(endDate, i + 1, i === roundsCount - 1);
      }).reverse();
    }

    static getRoundByNumber(roundNumber: number): Round {
      const allRounds = Round.getAllRounds();
      return allRounds.find(round => round.value === String(roundNumber))!;
    }

    static getRoundByDate(date: Date): Round {
      const roundNumber = Math.ceil((date.getTime() - Round.FIRST_ROUND_END_DATE.getTime()) / Round.ONE_WEEK_IN_MS);
      return Round.getRoundByNumber(roundNumber);
    }
  }

//   console.log(Round.getRoundTimestamp(5));
//   export console.log(Round.getAllRounds());
//   console.log(Round.getRoundByNumber(2));
//   console.log(Round.getRoundByDate(new Date("2022-05-10T10:00:00.000Z")));
