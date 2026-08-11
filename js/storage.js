// =====================================
// STORAGE SYSTEM
// Personal Saving Dashboard
// =====================================


// =====================================
// STORAGE KEY
// =====================================

const STORAGE_KEYS = {

    accounts: "psd_accounts",

    transactions: "psd_transactions",

    budgets: "psd_budgets",

    preferences: "psd_preferences"

};


// =====================================
// GENERIC SAVE DATA
// =====================================

function saveData(key, data) {

    localStorage.setItem(
        key,
        JSON.stringify(data)
    );

}


// =====================================
// GENERIC GET DATA
// =====================================

function getData(key, defaultValue = []) {

    const data = localStorage.getItem(key);

    if (data === null) {

        return defaultValue;

    }

    try {

        return JSON.parse(data);

    } catch (error) {

        console.error(
            "Gagal membaca data:",
            error
        );

        return defaultValue;

    }

}


// =====================================
// ACCOUNTS
// =====================================

function getAccounts() {

    return getData(
        STORAGE_KEYS.accounts,
        []
    );

}


function saveAccounts(accounts) {

    saveData(
        STORAGE_KEYS.accounts,
        accounts
    );

}


// =====================================
// TRANSACTIONS
// =====================================

function getTransactions() {

    return getData(
        STORAGE_KEYS.transactions,
        []
    );

}


function saveTransactions(transactions) {

    saveData(
        STORAGE_KEYS.transactions,
        transactions
    );

}


// =====================================
// BUDGETS
// =====================================

function getBudgets() {

    return getData(
        STORAGE_KEYS.budgets,
        []
    );

}


function saveBudgets(budgets) {

    saveData(
        STORAGE_KEYS.budgets,
        budgets
    );

}


// =====================================
// PREFERENCES
// =====================================

function getPreferences() {

    return getData(
        STORAGE_KEYS.preferences,
        {

            showTotalSavings: true,

            showTargets: true,

            showProgress: true,

            showAccounts: true,

            showChart: true,

            showRecentTransactions: true

        }
    );

}


function savePreferences(preferences) {

    saveData(
        STORAGE_KEYS.preferences,
        preferences
    );

}