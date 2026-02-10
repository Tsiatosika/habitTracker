const calculateStreak = (checks) => {
    if (checks.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Trier par date décroissante
    const sortedChecks = checks
        .filter(c => c.completed)
        .sort((a, b) => new Date(b.check_date) - new Date(a.check_date));

    if (sortedChecks.length === 0) return 0;

    // Vérifier si le dernier check est aujourd'hui ou hier
    const lastCheckDate = new Date(sortedChecks[0].check_date);
    lastCheckDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((today - lastCheckDate) / (1000 * 60 * 60 * 24));

    // Si le dernier check est trop vieux (plus d'un jour), streak = 0
    if (diffDays > 1) return 0;

    let streak = 0;
    let expectedDate = new Date(lastCheckDate);

    for (const check of sortedChecks) {
        const checkDate = new Date(check.check_date);
        checkDate.setHours(0, 0, 0, 0);

        if (checkDate.getTime() === expectedDate.getTime()) {
            streak++;
            expectedDate.setDate(expectedDate.getDate() - 1);
        } else {
            break;
        }
    }

    return streak;
};

module.exports = { calculateStreak };