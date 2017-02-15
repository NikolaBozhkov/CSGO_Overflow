export class User {
    id: string
    name: string
    tradeUrl: string
    staticCurrency: number
    activeCurrency: number
    avatarUrl: string
    level: number
    experienceTreshold: number
    experience: number
    wonAmount: number
    lostAmount: number
    wins: number
    losses: number
    clearance: string
    referrals: number
    referralCurrency: number

    constructor(user: User) {
        this.id = user.id;
        this.name = user.name;
        this.tradeUrl = user.tradeUrl;
        this.staticCurrency = user.staticCurrency;
        this.activeCurrency = user.activeCurrency;
        this.avatarUrl = user.avatarUrl;
        this.level = user.level;
        this.experienceTreshold = user.experienceTreshold;
        this.experience = user.experience;
        this.wonAmount = user.wonAmount;
        this.lostAmount = user.lostAmount;
        this.name = user.name;
        this.wins = user.wins;
        this.losses = user.losses;
        this.referrals = user.referrals;
        this.referralCurrency = user.referralCurrency;
    }

    getPreviousExpTreshold() {
        return (Math.pow(this.level, 2) * this.experienceTreshold) / Math.pow(this.level + 1, 2);
    }

    getExperienceDifference() {
        return this.experienceTreshold - this.getPreviousExpTreshold();
    }

    getExperiencePercent() {
        var currExpOfLvl = this.experience - this.getPreviousExpTreshold();
        return this.getExpAsPercentOfDifference(currExpOfLvl);
    }

    getExpAsPercentOfDifference(experience: number) {
        return Math.round(experience / this.getExperienceDifference() * 100);
    }
}
