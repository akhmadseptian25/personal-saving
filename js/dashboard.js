// =====================================
// DASHBOARD
// Personal Saving Dashboard
// =====================================

function renderDashboard() {

    const app = document.getElementById("app");

    const accounts = getAccounts();
    const transactions = getTransactions();
    const preferences = getPreferences();

    // =================================
    // HITUNG TOTAL TABUNGAN PER AKUN
    // =================================

    const accountBalances = {};

    accounts.forEach(account => {
        accountBalances[account.id] = 0;
    });

    transactions.forEach(transaction => {

        if (
            transaction.accountId &&
            accountBalances[transaction.accountId] !== undefined
        ) {
            accountBalances[transaction.accountId] +=
                Number(transaction.amount) || 0;
        }

    });

    // =================================
    // TOTAL
    // =================================

    const totalSavings =
        Object.values(accountBalances)
            .reduce(
                (total, amount) => total + amount,
                0
            );

    const totalTarget =
        accounts.reduce(
            (total, account) =>
                total + (Number(account.target) || 0),
            0
        );

    const remainingTarget =
        Math.max(
            totalTarget - totalSavings,
            0
        );

    const overallProgress =
        totalTarget > 0
            ? Math.min(
                (totalSavings / totalTarget) * 100,
                100
            )
            : 0;

    // =================================
    // TRANSAKSI TERBARU
    // =================================

    const recentTransactions =
        [...transactions]
            .sort(
                (a, b) =>
                    new Date(b.date) -
                    new Date(a.date)
            )
            .slice(0, 5);

    // =================================
    // HTML
    // =================================

    let html = `

        <div class="dashboard-page">

            <div class="dashboard-header">

                <div>
                    <h2>Ringkasan Tabungan</h2>

                    <p>
                        Pantau perkembangan tabungan
                        dan target keuangan Anda.
                    </p>
                </div>

            </div>


            <!-- =========================
                 SUMMARY CARDS
            ========================== -->

            <div class="summary-grid">

                <div class="summary-card">

                    <div class="summary-icon">
                        💰
                    </div>

                    <div class="summary-label">
                        Total Tabungan
                    </div>

                    <div class="summary-value">
                        ${formatCurrency(totalSavings)}
                    </div>

                </div>


                <div class="summary-card">

                    <div class="summary-icon">
                        🎯
                    </div>

                    <div class="summary-label">
                        Total Target
                    </div>

                    <div class="summary-value">
                        ${formatCurrency(totalTarget)}
                    </div>

                </div>


                <div class="summary-card">

                    <div class="summary-icon">
                        📌
                    </div>

                    <div class="summary-label">
                        Sisa Target
                    </div>

                    <div class="summary-value">
                        ${formatCurrency(remainingTarget)}
                    </div>

                </div>


                <div class="summary-card">

                    <div class="summary-icon">
                        📈
                    </div>

                    <div class="summary-label">
                        Progress
                    </div>

                    <div class="summary-value">
                        ${overallProgress.toFixed(1)}%
                    </div>

                </div>

            </div>


            <!-- =========================
                 OVERALL PROGRESS
            ========================== -->

            ${
                preferences.showProgress
                    ? `

                <div class="dashboard-section">

                    <div class="section-header">

                        <div>
                            <h3>Progress Keseluruhan</h3>

                            <p>
                                Perkembangan menuju seluruh
                                target tabungan.
                            </p>
                        </div>

                        <strong>
                            ${overallProgress.toFixed(1)}%
                        </strong>

                    </div>


                    <div class="progress-bar">

                        <div
                            class="progress-fill"
                            style="width: ${overallProgress}%"
                        ></div>

                    </div>


                    <div class="progress-info">

                        <span>
                            ${formatCurrency(totalSavings)}
                        </span>

                        <span>
                            ${formatCurrency(totalTarget)}
                        </span>

                    </div>

                </div>

            `
                    : ""
            }


            <!-- =========================
                 ACCOUNTS
            ========================== -->

            ${
                preferences.showAccounts
                    ? `

                <div class="dashboard-section">

                    <div class="section-header">

                        <div>
                            <h3>Akun Tabungan</h3>

                            <p>
                                Perkembangan masing-masing
                                akun tabungan.
                            </p>
                        </div>

                    </div>


                    <div class="dashboard-account-grid">

                        ${
                            accounts.length === 0
                                ? `

                            <div class="empty-state">

                                <div class="empty-icon">
                                    💰
                                </div>

                                <h3>
                                    Belum ada akun
                                </h3>

                                <p>
                                    Tambahkan akun tabungan
                                    melalui menu Setting.
                                </p>

                            </div>

                        `
                                : accounts
                                    .map(account => {

                                        const balance =
                                            accountBalances[
                                                account.id
                                            ] || 0;

                                        const target =
                                            Number(
                                                account.target
                                            ) || 0;

                                        const progress =
                                            target > 0
                                                ? Math.min(
                                                    (balance / target) * 100,
                                                    100
                                                )
                                                : 0;

                                        return `

                                            <div class="dashboard-account-card">

                                                <div class="account-card-top">

                                                    <div class="account-icon">
                                                        🏦
                                                    </div>

                                                    <div>

                                                        <h4>
                                                            ${account.name}
                                                        </h4>

                                                        <p>
                                                            Target:
                                                            ${formatCurrency(target)}
                                                        </p>

                                                    </div>

                                                </div>


                                                <div class="account-balance">

                                                    ${formatCurrency(balance)}

                                                </div>


                                                <div class="progress-bar">

                                                    <div
                                                        class="progress-fill"
                                                        style="width: ${progress}%"
                                                    ></div>

                                                </div>


                                                <div class="account-progress-info">

                                                    <span>
                                                        ${progress.toFixed(1)}%
                                                    </span>

                                                    <span>
                                                        ${formatCurrency(target)}
                                                    </span>

                                                </div>

                                            </div>

                                        `;

                                    })
                                    .join("")
                        }

                    </div>

                </div>

            `
                    : ""
            }


            <!-- =========================
                 RECENT TRANSACTIONS
            ========================== -->

            ${
                preferences.showRecentTransactions
                    ? `

                <div class="dashboard-section">

                    <div class="section-header">

                        <div>
                            <h3>Transaksi Terbaru</h3>

                            <p>
                                Riwayat tabungan terakhir Anda.
                            </p>
                        </div>

                    </div>


                    ${
                        recentTransactions.length === 0
                            ? `

                        <div class="empty-state">

                            <div class="empty-icon">
                                📝
                            </div>

                            <h3>
                                Belum ada transaksi
                            </h3>

                            <p>
                                Mulai mencatat tabungan
                                Anda melalui menu
                                Input Tabungan.
                            </p>

                        </div>

                    `
                            : `

                        <div class="transaction-list">

                            ${
                                recentTransactions
                                    .map(transaction => {

                                        const account =
                                            accounts.find(
                                                item =>
                                                    item.id ===
                                                    transaction.accountId
                                            );

                                        return `

                                            <div class="dashboard-transaction">

                                                <div class="transaction-icon">
                                                    💰
                                                </div>

                                                <div class="transaction-info">

                                                    <strong>
                                                        ${
                                                            account
                                                                ? account.name
                                                                : "Akun"
                                                        }
                                                    </strong>

                                                    <span>
                                                        ${
                                                            transaction.note ||
                                                            "Tabungan"
                                                        }
                                                    </span>

                                                    <small>
                                                        ${formatDate(
                                                            transaction.date
                                                        )}
                                                    </small>

                                                </div>

                                                <div class="transaction-amount">
                                                    +
                                                    ${formatCurrency(
                                                        transaction.amount
                                                    )}
                                                </div>

                                            </div>

                                        `;

                                    })
                                    .join("")
                            }

                        </div>

                    `

                    }

                </div>

            `
                    : ""
            }

        </div>

    `;

    app.innerHTML = html;
}


// =====================================
// FORMAT DATE
// =====================================

function formatDate(date) {

    if (!date) {
        return "-";
    }

    const parsedDate =
        new Date(date);

    if (isNaN(parsedDate.getTime())) {
        return date;
    }

    return parsedDate.toLocaleDateString(
        "id-ID",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );
}