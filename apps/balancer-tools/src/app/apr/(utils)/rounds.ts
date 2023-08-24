export class Round {
  public static FIRST_ROUND_END_DATE = new Date("2022-04-14T00:00:00.000Z");
  private static ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

  endDate: Date;
  startDate: Date;
  value: string;
  activeRound: boolean;

  constructor(endDate: Date, roundNumber: number) {
    this.endDate = endDate;
    this.startDate = new Date(endDate.getTime() - Round.ONE_WEEK_IN_MS);
    this.value = String(roundNumber);
    this.activeRound = endDate.getTime() > Date.now();
  }

  get label(): string {
    return this.endDate.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  static getRoundTimestamp(roundNumber: number | string): number {
    return (
      Round.FIRST_ROUND_END_DATE.getTime() +
      (Math.floor(Number(roundNumber)) - 1) * Round.ONE_WEEK_IN_MS
    );
  }

  static getAllRounds(): Round[] {
    const roundsCount =
      Math.ceil(
        (Date.now() - Round.FIRST_ROUND_END_DATE.getTime()) /
          Round.ONE_WEEK_IN_MS,
      ) + 1;

    return Array.from({ length: roundsCount }, (_, i) => {
      const endDate = new Date(
        Round.FIRST_ROUND_END_DATE.getTime() + i * Round.ONE_WEEK_IN_MS,
      );
      return new Round(endDate, i + 1);
    }).reverse();
  }

  static currentRound(): Round {
    const allRounds = Round.getAllRounds();
    return allRounds.find((round) => round.activeRound)!;
  }

  static getRoundByNumber(roundNumber: number | string): Round {
    const allRounds = Round.getAllRounds();
    return allRounds.find((round) => round.value === String(roundNumber))!;
  }

  static getRoundByDate(date: Date): Round {
    if (date < Round.FIRST_ROUND_END_DATE) {
      // eslint-disable-next-line no-console
      console.debug(
        "getRoundByDate received a date that is before first round",
      );
      return Round.getRoundByNumber(1);
    } else if (date > Round.currentRound().endDate) {
      // eslint-disable-next-line no-console
      console.debug(
        "getRoundByDate received a date that is after current round",
      );
      return Round.currentRound();
    }

    const roundNumber = Math.ceil(
      (date.getTime() - Round.FIRST_ROUND_END_DATE.getTime()) /
        Round.ONE_WEEK_IN_MS,
    );
    return Round.getRoundByNumber(roundNumber);
  }
}
