// =====================================
// PERSONAL SAVING DASHBOARD
// APP.JS
// =====================================

document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // ELEMENT
    // =====================================

    const app =
        document.getElementById("app");

    const pageTitle =
        document.getElementById("pageTitle");

        // =================================
// MOBILE MENU
// =================================

const mobileMenuButton =
    document.getElementById("mobileMenuButton");

const mobileMenuOverlay =
    document.getElementById("mobileMenuOverlay");

const sidebar =
    document.querySelector(".sidebar");


// =================================
// BUKA / TUTUP MOBILE MENU
// =================================

function toggleMobileMenu() {

    if (!sidebar) {
        return;
    }

    sidebar.classList.toggle("mobile-open");

    const isOpen =
        sidebar.classList.contains("mobile-open");


    if (mobileMenuButton) {

        mobileMenuButton.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );

        mobileMenuButton.textContent =
            isOpen ? "✕" : "☰";
    }


    if (mobileMenuOverlay) {

        mobileMenuOverlay.classList.toggle(
            "show",
            isOpen
        );
    }
}


// =================================
// BUTTON MENU
// =================================

if (mobileMenuButton) {

    mobileMenuButton.addEventListener(
        "click",
        toggleMobileMenu
    );

}


// =================================
// KLIK OVERLAY
// =================================

if (mobileMenuOverlay) {

    mobileMenuOverlay.addEventListener(
        "click",
        function () {

            if (
                sidebar &&
                sidebar.classList.contains(
                    "mobile-open"
                )
            ) {

                toggleMobileMenu();

            }

        }
    );

}

    const navItems =
        document.querySelectorAll(".nav-item");

    const mobileNavItems =
        document.querySelectorAll(".mobile-nav-item");


    // =====================================
    // HELPER
    // =====================================

    function formatCurrency(value) {

        return new Intl.NumberFormat(
            "id-ID",
            {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0
            }
        ).format(Number(value) || 0);

    }


    function escapeHtml(value) {

        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }


    function getToday() {

        const date =
            new Date();

        const offset =
            date.getTimezoneOffset();

        const localDate =
            new Date(
                date.getTime() -
                offset * 60000
            );

        return localDate
            .toISOString()
            .slice(0, 10);

    }


    function formatDate(value) {

        if (!value) {
            return "-";
        }

        const date =
            new Date(
                value +
                (
                    String(value).length === 10
                        ? "T00:00:00"
                        : ""
                )
            );

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return value;
        }

        return date.toLocaleDateString(
            "id-ID",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

    }


    // =====================================
    // BUDGET STORAGE COMPATIBILITY
    // =====================================

    function getBudgetData() {

        const data =
            getBudgets();


        // Format baru
        if (
            data &&
            !Array.isArray(data) &&
            typeof data === "object"
        ) {

            return {

                salary:
                    Number(data.salary) || 0,

                allocations:
                    Array.isArray(
                        data.allocations
                    )
                        ? data.allocations
                        : [],

                recommendations:
                    Array.isArray(
                        data.recommendations
                    )
                        ? data.recommendations
                        : []

            };

        }


        // Format lama
        return {

            salary: 0,

            allocations: [],

            recommendations:
                Array.isArray(data)
                    ? data
                    : []

        };

    }


    function saveBudgetData(data) {

        saveBudgets(data);

    }


    // =====================================
    // ACCOUNT HELPER
    // =====================================

    function accountId(account) {

        return (
            account.id ??
            account.accountId
        );

    }


    function accountName(account) {

        return (
            account.name ??
            account.accountName ??
            "Tanpa Nama"
        );

    }


    // =====================================
    // TRANSACTION HELPER
    // =====================================

    function transactionAmount(transaction) {

        return Number(
            transaction.amount ??
            transaction.nominal ??
            0
        ) || 0;

    }


    function transactionAccountId(transaction) {

        return (
            transaction.accountId ??
            transaction.accountID ??
            null
        );

    }


    function transactionAccountName(transaction) {

        return (
            transaction.accountName ??
            transaction.account ??
            ""
        );

    }


    function transactionDate(transaction) {

        return (
            transaction.date ??
            transaction.tanggal ??
            ""
        );

    }


    function transactionNote(transaction) {

        return (
            transaction.note ??
            transaction.description ??
            transaction.keterangan ??
            ""
        );

    }


    // =====================================
    // ACCOUNT BALANCE
    // =====================================

    function getAccountBalance(account) {

        const id =
            accountId(account);

        const name =
            accountName(account);


        return getTransactions().reduce(
            function (total, transaction) {

                const transactionId =
                    transactionAccountId(
                        transaction
                    );

                const transactionName =
                    transactionAccountName(
                        transaction
                    );


                const match =
                    (
                        transactionId !== null &&
                        String(transactionId)
                        ===
                        String(id)
                    )
                    ||
                    (
                        !transactionId &&
                        transactionName === name
                    );


                if (match) {

                    return total +
                        transactionAmount(
                            transaction
                        );

                }


                return total;

            },
            0
        );

    }


    // =====================================
    // NAVIGATION
    // =====================================

    function updateActiveNavigation(page) {

        navItems.forEach(
            function (item) {

                item.classList.toggle(
                    "active",
                    item.dataset.page === page
                );

            }
        );


        mobileNavItems.forEach(
            function (item) {

                item.classList.toggle(
                    "active",
                    item.dataset.page === page
                );

            }
        );

    }


    function openPage(page) {

        const titles = {

            dashboard:
                "Dashboard",

            budgeting:
                "Budgeting / Alokasi Gaji",

            transactions:
                "Input Tabungan",

            settings:
                "Setting"

        };


        if (pageTitle) {

            pageTitle.textContent =
                titles[page] ||
                "Personal Saving Dashboard";

        }


        if (page === "dashboard") {

            renderDashboard();

        }

        else if (page === "budgeting") {

            renderBudgeting();

        }

        else if (page === "transactions") {

            renderTransactions();

        }

        else if (page === "settings") {

            renderSettings();

        }


        updateActiveNavigation(page);

    }

navItems.forEach(function (item) {

    item.addEventListener("click", function () {

        const page = item.dataset.page;

        openPage(page);


        // Tutup menu setelah memilih halaman
        if (
            sidebar &&
            sidebar.classList.contains(
                "mobile-open"
            )
        ) {

            toggleMobileMenu();

        }

    });
});


    mobileNavItems.forEach(
        function (item) {

            item.addEventListener(
                "click",
                function () {

                    openPage(
                        item.dataset.page
                    );

                }
            );

        }
    );


    // =====================================
    // DASHBOARD
    // =====================================

    function renderDashboard() {

        const accounts =
            getAccounts();

        const transactions =
            getTransactions();

        const preferences =
            getPreferences() || {};


        const totalSavings =
            accounts.reduce(
                function (total, account) {

                    return total +
                        getAccountBalance(
                            account
                        );

                },
                0
            );


        const totalTarget =
            accounts.reduce(
                function (total, account) {

                    return total +
                        (
                            Number(
                                account.target
                            ) || 0
                        );

                },
                0
            );


        const remainingTarget =
            Math.max(
                totalTarget -
                totalSavings,
                0
            );


        const progress =
            totalTarget > 0
                ? Math.min(
                    (
                        totalSavings /
                        totalTarget
                    ) * 100,
                    100
                )
                : 0;


        const recent =
            [...transactions]
                .sort(
                    function (a, b) {

                        return (
                            new Date(
                                transactionDate(b)
                            )
                            -
                            new Date(
                                transactionDate(a)
                            )
                        );

                    }
                )
                .slice(0, 5);


        app.innerHTML = `

            <div class="page-content">

                <h2>
                    Ringkasan Tabungan
                </h2>

                <p>
                    Pantau seluruh tabungan
                    dan target Anda.
                </p>


                <!-- ========================= -->
                <!-- SUMMARY -->
                <!-- ========================= -->

                <div class="dashboard-summary">

                    ${
                        preferences.showTotalSavings !== false
                        ?
                        `
                        <div class="summary-card">

                            <div>
                                💰
                            </div>

                            <p>
                                Total Tabungan
                            </p>

                            <strong>
                                ${formatCurrency(
                                    totalSavings
                                )}
                            </strong>

                        </div>
                        `
                        :
                        ""
                    }


                    ${
                        preferences.showTargets !== false
                        ?
                        `
                        <div class="summary-card">

                            <div>
                                🎯
                            </div>

                            <p>
                                Total Target
                            </p>

                            <strong>
                                ${formatCurrency(
                                    totalTarget
                                )}
                            </strong>

                        </div>


                        <div class="summary-card">

                            <div>
                                📌
                            </div>

                            <p>
                                Sisa Target
                            </p>

                            <strong>
                                ${formatCurrency(
                                    remainingTarget
                                )}
                            </strong>

                        </div>
                        `
                        :
                        ""
                    }


                    ${
                        preferences.showProgress !== false
                        ?
                        `
                        <div class="summary-card">

                            <div>
                                📈
                            </div>

                            <p>
                                Progress
                            </p>

                            <strong>
                                ${progress.toFixed(1)}%
                            </strong>

                        </div>
                        `
                        :
                        ""
                    }

                </div>


                <!-- ========================= -->
                <!-- ACCOUNT -->
                <!-- ========================= -->

                ${
                    preferences.showAccounts !== false
                    ?
                    `
                    <section>

                        <h2>
                            Akun Tabungan
                        </h2>


                        ${
                            accounts.length === 0

                            ?

                            `
                            <p>
                                Belum ada akun.
                                Silakan tambahkan
                                melalui Setting.
                            </p>
                            `

                            :

                            accounts.map(
                                function (account) {

                                    const target =
                                        Number(
                                            account.target
                                        ) || 0;

                                    const balance =
                                        getAccountBalance(
                                            account
                                        );

                                    const accountProgress =
                                        target > 0
                                            ? Math.min(
                                                (
                                                    balance /
                                                    target
                                                ) * 100,
                                                100
                                            )
                                            : 0;

                                    const remaining =
                                        Math.max(
                                            target -
                                            balance,
                                            0
                                        );


                                    return `

                                        <div class="account-card">

                                            <div class="account-icon">
                                                🏦
                                            </div>

                                            <h3>
                                                ${escapeHtml(
                                                    accountName(
                                                        account
                                                    )
                                                )}
                                            </h3>

                                            <p>
                                                Target:
                                                <strong>
                                                    ${formatCurrency(
                                                        target
                                                    )}
                                                </strong>
                                            </p>

                                            <p>
                                                Saldo:
                                                <strong>
                                                    ${formatCurrency(
                                                        balance
                                                    )}
                                                </strong>
                                            </p>

                                            <p>
                                                Progress:
                                                <strong>
                                                    ${accountProgress.toFixed(1)}%
                                                </strong>
                                            </p>

                                            <div class="progress-track">

                                                <div
                                                    class="progress-fill"
                                                    style="width:${accountProgress}%"
                                                ></div>

                                            </div>

                                            <p>
                                                Sisa:
                                                ${formatCurrency(
                                                    remaining
                                                )}
                                            </p>

                                        </div>

                                    `;

                                }
                            ).join("")

                        }

                    </section>
                    `
                    :
                    ""
                }


                <!-- ========================= -->
                <!-- RECENT TRANSACTIONS -->
                <!-- ========================= -->

                ${
                    preferences.showRecentTransactions !== false
                    ?
                    `
                    <section>

                        <h2>
                            Transaksi Terbaru
                        </h2>


                        ${
                            recent.length === 0

                            ?

                            `
                            <p>
                                Belum ada transaksi.
                            </p>
                            `

                            :

                            recent.map(
                                function (item) {

                                    return `

                                        <div class="transaction-item">

                                            <strong>
                                                ${escapeHtml(
                                                    transactionAccountName(
                                                        item
                                                    )
                                                )}
                                            </strong>

                                            <span>
                                                ${formatDate(
                                                    transactionDate(
                                                        item
                                                    )
                                                )}
                                            </span>

                                            <strong>
                                                +
                                                ${formatCurrency(
                                                    transactionAmount(
                                                        item
                                                    )
                                                )}
                                            </strong>

                                            <p>
                                                ${escapeHtml(
                                                    transactionNote(
                                                        item
                                                    )
                                                )}
                                            </p>

                                        </div>

                                    `;

                                }
                            ).join("")

                        }

                    </section>
                    `
                    :
                    ""
                }

            </div>

        `;

    }


    // =====================================
    // BUDGETING
    // =====================================

    function renderBudgeting() {

        const budget =
            getBudgetData();

        const salary =
            budget.salary;

        const categories =
            budget.recommendations;


        const totalPercentage =
            categories.reduce(
                function (total, item) {

                    return total +
                        (
                            Number(
                                item.percentage
                            ) || 0
                        );

                },
                0
            );


        const totalRecommendation =
            salary *
            totalPercentage /
            100;


        const totalActual =
            categories.reduce(
                function (total, item) {

                    return total +
                        (
                            Number(
                                item.actual
                            ) || 0
                        );

                },
                0
            );


        app.innerHTML = `

            <div class="page-content">

                <h2>
                    Budgeting / Alokasi Gaji
                </h2>

                <p>
                    Rekomendasi berdasarkan
                    persentase yang Anda atur
                    di Setting.
                </p>


                <!-- ========================= -->
                <!-- SALARY -->
                <!-- ========================= -->

                <section>

                    <h3>
                        Gaji Bulanan
                    </h3>

                    <input
                        type="number"
                        id="salaryInput"
                        min="0"
                        placeholder="Contoh: 2770000"
                        value="${salary || ""}"
                    >

                    <button
                        id="saveSalaryButton"
                    >
                        Simpan Gaji
                    </button>

                </section>


                <!-- ========================= -->
                <!-- SUMMARY -->
                <!-- ========================= -->

                <section>

                    <h3>
                        Ringkasan
                    </h3>

                    <p>
                        Total Persentase:
                        <strong>
                            ${totalPercentage.toFixed(1)}%
                        </strong>
                    </p>

                    <p>
                        Total Rekomendasi:
                        <strong>
                            ${formatCurrency(
                                totalRecommendation
                            )}
                        </strong>
                    </p>

                    <p>
                        Total Aktual:
                        <strong>
                            ${formatCurrency(
                                totalActual
                            )}
                        </strong>
                    </p>

                    ${
                        totalPercentage === 100

                        ?

                        `
                        <p>
                            ✓ Alokasi sudah mencapai 100%.
                        </p>
                        `

                        :

                        `
                        <p>
                            ⚠ Total persentase belum 100%.
                            Anda dapat mengaturnya melalui
                            Setting.
                        </p>
                        `

                    }

                </section>


                <!-- ========================= -->
                <!-- ALLOCATION -->
                <!-- ========================= -->

                <section>

                    <h3>
                        Rekomendasi Alokasi
                    </h3>


                    ${
                        categories.length === 0

                        ?

                        `
                        <p>
                            Belum ada kategori.
                            Tambahkan melalui Setting.
                        </p>
                        `

                        :

                        categories.map(
                            function (item) {

                                const percentage =
                                    Number(
                                        item.percentage
                                    ) || 0;

                                const recommendation =
                                    salary *
                                    percentage /
                                    100;

                                const actual =
                                    Number(
                                        item.actual
                                    ) || 0;


                                return `

                                    <div class="allocation-item">

                                        <h3>
                                            ${escapeHtml(
                                                item.name
                                            )}
                                        </h3>

                                        <p>
                                            Persentase:
                                            <strong>
                                                ${percentage}%
                                            </strong>
                                        </p>

                                        <p>
                                            Rekomendasi:
                                            <strong>
                                                ${formatCurrency(
                                                    recommendation
                                                )}
                                            </strong>
                                        </p>


                                        <label>
                                            Nominal Aktual
                                        </label>

                                        <input
                                            type="number"
                                            class="actual-budget-input"
                                            data-id="${escapeHtml(
                                                String(
                                                    item.id
                                                )
                                            )}"
                                            min="0"
                                            value="${actual || ""}"
                                            placeholder="Masukkan nominal aktual"
                                        >

                                    </div>

                                `;

                            }
                        ).join("")

                    }

                </section>


                ${
                    categories.length > 0

                    ?

                    `
                    <button
                        id="saveActualBudgetButton"
                    >
                        💾 Simpan Nominal Aktual
                    </button>
                    `

                    :
                    ""
                }

            </div>

        `;


        document
            .getElementById(
                "saveSalaryButton"
            )
            ?.addEventListener(
                "click",
                saveSalary
            );


        document
            .getElementById(
                "saveActualBudgetButton"
            )
            ?.addEventListener(
                "click",
                saveActualBudget
            );

    }


    function saveSalary() {

        const salary =
            Number(
                document.getElementById(
                    "salaryInput"
                )?.value
            );


        if (!salary || salary <= 0) {

            alert(
                "Masukkan nominal gaji yang valid."
            );

            return;

        }


        const budget =
            getBudgetData();


        budget.salary =
            salary;


        saveBudgetData(
            budget
        );


        renderBudgeting();

    }


    function saveActualBudget() {

        const budget =
            getBudgetData();


        document
            .querySelectorAll(
                ".actual-budget-input"
            )
            .forEach(
                function (input) {

                    const id =
                        input.dataset.id;

                    const item =
                        budget.recommendations.find(
                            function (category) {

                                return String(
                                    category.id
                                )
                                ===
                                String(id);

                            }
                        );


                    if (item) {

                        item.actual =
                            Number(
                                input.value
                            ) || 0;

                    }

                }
            );


        saveBudgetData(
            budget
        );


        alert(
            "Nominal aktual berhasil disimpan."
        );


        renderBudgeting();

    }


    // =====================================
    // INPUT TABUNGAN
    // =====================================

    function renderTransactions() {

        const accounts =
            getAccounts();

        const transactions =
            getTransactions();


        app.innerHTML = `

            <div class="page-content">

                <h2>
                    Input Tabungan
                </h2>

                <p>
                    Masukkan tabungan yang
                    benar-benar Anda simpan.
                </p>


                ${
                    accounts.length === 0

                    ?

                    `
                    <div>

                        <h3>
                            Belum ada akun
                        </h3>

                        <p>
                            Buat akun terlebih dahulu
                            melalui Setting.
                        </p>

                    </div>
                    `

                    :

                    `

                    <section>

                        <label>
                            Akun Tabungan
                        </label>

                        <select
                            id="transactionAccount"
                        >

                            ${accounts.map(
                                function (account) {

                                    return `

                                        <option
                                            value="${escapeHtml(
                                                String(
                                                    accountId(
                                                        account
                                                    )
                                                )
                                            )}"
                                        >
                                            ${escapeHtml(
                                                accountName(
                                                    account
                                                )
                                            )}
                                        </option>

                                    `;

                                }
                            ).join("")}

                        </select>


                        <label>
                            Jumlah Tabungan
                        </label>

                        <input
                            type="number"
                            id="transactionAmount"
                            min="1"
                            placeholder="Contoh: 500000"
                        >


                        <label>
                            Tanggal
                        </label>

                        <input
                            type="date"
                            id="transactionDate"
                            value="${getToday()}"
                        >


                        <label>
                            Keterangan
                        </label>

                        <input
                            type="text"
                            id="transactionNote"
                            placeholder="Contoh: Tabungan bulan ini"
                        >


                        <button
                            id="saveTransactionButton"
                        >
                            + Simpan Tabungan
                        </button>

                    </section>

                    `

                }


                <!-- ========================= -->
                <!-- RIWAYAT -->
                <!-- ========================= -->

                <section>

                    <h2>
                        Riwayat Tabungan
                    </h2>


                    ${
                        transactions.length === 0

                        ?

                        `
                        <p>
                            Belum ada riwayat tabungan.
                        </p>
                        `

                        :

                        [...transactions]
                            .sort(
                                function (a, b) {

                                    return (
                                        new Date(
                                            transactionDate(b)
                                        )
                                        -
                                        new Date(
                                            transactionDate(a)
                                        )
                                    );

                                }
                            )
                            .map(
                                function (item) {

                                    return `

                                        <div class="transaction-item">

                                            <strong>
                                                ${escapeHtml(
                                                    transactionAccountName(
                                                        item
                                                    )
                                                )}
                                            </strong>

                                            <p>
                                                ${formatDate(
                                                    transactionDate(
                                                        item
                                                    )
                                                )}
                                            </p>

                                            <strong>
                                                +
                                                ${formatCurrency(
                                                    transactionAmount(
                                                        item
                                                    )
                                                )}
                                            </strong>

                                            <p>
                                                ${escapeHtml(
                                                    transactionNote(
                                                        item
                                                    )
                                                )}
                                            </p>

                                            <button
                                                class="delete-transaction"
                                                data-id="${escapeHtml(
                                                    String(
                                                        item.id
                                                    )
                                                )}"
                                            >
                                                Hapus
                                            </button>

                                        </div>

                                    `;

                                }
                            ).join("")

                    }

                </section>

            </div>

        `;


        document
            .getElementById(
                "saveTransactionButton"
            )
            ?.addEventListener(
                "click",
                saveTransaction
            );


        document
            .querySelectorAll(
                ".delete-transaction"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            deleteTransaction(
                                button.dataset.id
                            );

                        }
                    );

                }
            );

    }


    function saveTransaction() {

        const selectedAccountId =
            document.getElementById(
                "transactionAccount"
            )?.value;

        const amount =
            Number(
                document.getElementById(
                    "transactionAmount"
                )?.value
            );

        const date =
            document.getElementById(
                "transactionDate"
            )?.value;

        const note =
            document.getElementById(
                "transactionNote"
            )?.value.trim() || "";


        const accounts =
            getAccounts();


        const account =
            accounts.find(
                function (item) {

                    return String(
                        accountId(item)
                    )
                    ===
                    String(
                        selectedAccountId
                    );

                }
            );


        if (!account) {

            alert(
                "Akun tabungan tidak ditemukan."
            );

            return;

        }


        if (!amount || amount <= 0) {

            alert(
                "Nominal tabungan harus lebih dari 0."
            );

            return;

        }


        if (!date) {

            alert(
                "Tanggal belum diisi."
            );

            return;

        }


        const transactions =
            getTransactions();


        transactions.push({

            id:
                Date.now().toString(),

            accountId:
                accountId(account),

            accountName:
                accountName(account),

            amount:
                amount,

            date:
                date,

            note:
                note

        });


        saveTransactions(
            transactions
        );


        alert(
            "Tabungan berhasil disimpan."
        );


        renderTransactions();

    }


    function deleteTransaction(id) {

        const transactions =
            getTransactions();


        const item =
            transactions.find(
                function (transaction) {

                    return String(
                        transaction.id
                    )
                    ===
                    String(id);

                }
            );


        if (!item) {

            return;

        }


        const confirmed =
            confirm(
                "Hapus transaksi " +
                formatCurrency(
                    transactionAmount(item)
                ) +
                "?"
            );


        if (!confirmed) {

            return;

        }


        saveTransactions(

            transactions.filter(
                function (transaction) {

                    return String(
                        transaction.id
                    )
                    !==
                    String(id);

                }
            )

        );


        renderTransactions();

    }


    // =====================================
    // SETTING
    // =====================================

    function renderSettings() {

        const accounts =
            getAccounts();

        const preferences =
            getPreferences() || {};

        const budget =
            getBudgetData();

        const categories =
            budget.recommendations;


        const totalPercentage =
            categories.reduce(
                function (total, item) {

                    return total +
                        (
                            Number(
                                item.percentage
                            ) || 0
                        );

                },
                0
            );


        app.innerHTML = `

            <div class="page-content">

                <h2>
                    Setting
                </h2>

                <p>
                    Semua pengaturan dashboard
                    dapat diubah dari halaman ini.
                </p>


                <!-- ========================= -->
                <!-- AKUN -->
                <!-- ========================= -->

                <section>

                    <h2>
                        Akun Tabungan
                    </h2>

                    <p>
                        Tambahkan akun dan tentukan
                        target masing-masing.
                    </p>


                    ${
                        accounts.length === 0

                        ?

                        `
                        <p>
                            Belum ada akun.
                        </p>
                        `

                        :

                        accounts.map(
                            function (account) {

                                return `

                                    <div class="setting-account-item">

                                        <h3>
                                            ${escapeHtml(
                                                accountName(
                                                    account
                                                )
                                            )}
                                        </h3>

                                        <p>
                                            Target:
                                            ${formatCurrency(
                                                account.target
                                            )}
                                        </p>

                                        <button
                                            class="edit-account"
                                            data-id="${escapeHtml(
                                                String(
                                                    accountId(
                                                        account
                                                    )
                                                )
                                            )}"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            class="delete-account"
                                            data-id="${escapeHtml(
                                                String(
                                                    accountId(
                                                        account
                                                    )
                                                )
                                            )}"
                                        >
                                            Hapus
                                        </button>

                                    </div>

                                `;

                            }
                        ).join("")

                    }

                </section>


                <!-- ========================= -->
                <!-- ACCOUNT FORM -->
                <!-- ========================= -->

                <section>

                    <h3 id="accountFormTitle">
                        Tambah Akun
                    </h3>

                    <input
                        type="hidden"
                        id="editingAccountId"
                    >

                    <label>
                        Nama Akun
                    </label>

                    <input
                        type="text"
                        id="accountNameInput"
                        placeholder="Contoh: BCA"
                    >

                    <label>
                        Target Tabungan
                    </label>

                    <input
                        type="number"
                        id="accountTargetInput"
                        min="0"
                        placeholder="Contoh: 5000000"
                    >

                    <button
                        id="saveAccountButton"
                    >
                        + Simpan Akun
                    </button>

                    <button
                        id="cancelAccountEditButton"
                        style="display:none;"
                    >
                        Batal
                    </button>

                </section>


                <!-- ========================= -->
                <!-- BUDGET CATEGORY -->
                <!-- ========================= -->

                <section>

                    <h2>
                        Persentase Budgeting
                    </h2>

                    <p>
                        Persentase ini hanya digunakan
                        sebagai rekomendasi.
                    </p>

                    <p>
                        Total:
                        <strong>
                            ${totalPercentage.toFixed(1)}%
                        </strong>
                    </p>


                    ${
                        totalPercentage === 100

                        ?

                        `
                        <p>
                            ✓ Total persentase 100%.
                        </p>
                        `

                        :

                        `
                        <p>
                            ⚠ Total persentase belum 100%.
                        </p>
                        `

                    }


                    ${
                        categories.length === 0

                        ?

                        `
                        <p>
                            Belum ada kategori.
                        </p>
                        `

                        :

                        categories.map(
                            function (item) {

                                return `

                                    <div class="budget-setting-item">

                                        <h3>
                                            ${escapeHtml(
                                                item.name
                                            )}
                                        </h3>

                                        <p>
                                            ${Number(
                                                item.percentage
                                            ) || 0}%
                                        </p>

                                        <button
                                            class="edit-budget"
                                            data-id="${escapeHtml(
                                                String(
                                                    item.id
                                                )
                                            )}"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            class="delete-budget"
                                            data-id="${escapeHtml(
                                                String(
                                                    item.id
                                                )
                                            )}"
                                        >
                                            Hapus
                                        </button>

                                    </div>

                                `;

                            }
                        ).join("")

                    }

                </section>


                <!-- ========================= -->
                <!-- BUDGET FORM -->
                <!-- ========================= -->

                <section>

                    <h3 id="budgetFormTitle">
                        Tambah Kategori
                    </h3>

                    <input
                        type="hidden"
                        id="editingBudgetId"
                    >

                    <label>
                        Nama Kategori
                    </label>

                    <input
                        type="text"
                        id="budgetNameInput"
                        placeholder="Contoh: SPP Kuliah"
                    >

                    <label>
                        Persentase
                    </label>

                    <input
                        type="number"
                        id="budgetPercentageInput"
                        min="0"
                        max="100"
                        step="0.1"
                        placeholder="Contoh: 17"
                    >

                    <button
                        id="saveBudgetButton"
                    >
                        + Simpan Kategori
                    </button>

                    <button
                        id="cancelBudgetButton"
                        style="display:none;"
                    >
                        Batal
                    </button>

                </section>


                <!-- ========================= -->
                <!-- DASHBOARD SETTINGS -->
                <!-- ========================= -->

                <section>

                    <h2>
                        Tampilan Dashboard
                    </h2>

                    <label>

                        <input
                            type="checkbox"
                            class="dashboard-setting"
                            data-key="showTotalSavings"
                            ${
                                preferences.showTotalSavings !== false
                                ? "checked"
                                : ""
                            }
                        >

                        Tampilkan Total Tabungan

                    </label>


                    <label>

                        <input
                            type="checkbox"
                            class="dashboard-setting"
                            data-key="showTargets"
                            ${
                                preferences.showTargets !== false
                                ? "checked"
                                : ""
                            }
                        >

                        Tampilkan Target

                    </label>


                    <label>

                        <input
                            type="checkbox"
                            class="dashboard-setting"
                            data-key="showProgress"
                            ${
                                preferences.showProgress !== false
                                ? "checked"
                                : ""
                            }
                        >

                        Tampilkan Progress

                    </label>


                    <label>

                        <input
                            type="checkbox"
                            class="dashboard-setting"
                            data-key="showAccounts"
                            ${
                                preferences.showAccounts !== false
                                ? "checked"
                                : ""
                            }
                        >

                        Tampilkan Akun

                    </label>


                    <label>

                        <input
                            type="checkbox"
                            class="dashboard-setting"
                            data-key="showRecentTransactions"
                            ${
                                preferences.showRecentTransactions !== false
                                ? "checked"
                                : ""
                            }
                        >

                        Tampilkan Transaksi Terbaru

                    </label>

                </section>

            </div>

        `;


        // =====================================
        // ACCOUNT EVENTS
        // =====================================

        document
            .getElementById(
                "saveAccountButton"
            )
            ?.addEventListener(
                "click",
                saveAccount
            );


        document
            .getElementById(
                "cancelAccountEditButton"
            )
            ?.addEventListener(
                "click",
                renderSettings
            );


        document
            .querySelectorAll(
                ".edit-account"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            editAccount(
                                button.dataset.id
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                ".delete-account"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            deleteAccount(
                                button.dataset.id
                            );

                        }
                    );

                }
            );


        // =====================================
        // BUDGET EVENTS
        // =====================================

        document
            .getElementById(
                "saveBudgetButton"
            )
            ?.addEventListener(
                "click",
                saveBudgetCategory
            );


        document
            .getElementById(
                "cancelBudgetButton"
            )
            ?.addEventListener(
                "click",
                renderSettings
            );


        document
            .querySelectorAll(
                ".edit-budget"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            editBudgetCategory(
                                button.dataset.id
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                ".delete-budget"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            deleteBudgetCategory(
                                button.dataset.id
                            );

                        }
                    );

                }
            );


        // =====================================
        // DASHBOARD SETTINGS
        // =====================================

        document
            .querySelectorAll(
                ".dashboard-setting"
            )
            .forEach(
                function (checkbox) {

                    checkbox.addEventListener(
                        "change",
                        saveDashboardSettings
                    );

                }
            );

    }


    // =====================================
    // SAVE ACCOUNT
    // =====================================

    function saveAccount() {

        const name =
            document.getElementById(
                "accountNameInput"
            )?.value.trim();

        const target =
            Number(
                document.getElementById(
                    "accountTargetInput"
                )?.value
            ) || 0;

        const editingId =
            document.getElementById(
                "editingAccountId"
            )?.value;


        if (!name) {

            alert(
                "Nama akun harus diisi."
            );

            return;

        }


        if (target < 0) {

            alert(
                "Target tidak boleh negatif."
            );

            return;

        }


        const accounts =
            getAccounts();


        if (editingId) {

            const account =
                accounts.find(
                    function (item) {

                        return String(
                            accountId(item)
                        )
                        ===
                        String(editingId);

                    }
                );


            if (account) {

                account.name =
                    name;

                account.target =
                    target;

            }

        }

        else {

            accounts.push({

                id:
                    Date.now().toString(),

                name:
                    name,

                target:
                    target

            });

        }


        saveAccounts(
            accounts
        );


        renderSettings();

    }


    // =====================================
    // EDIT ACCOUNT
    // =====================================

    function editAccount(id) {

        const accounts =
            getAccounts();


        const account =
            accounts.find(
                function (item) {

                    return String(
                        accountId(item)
                    )
                    ===
                    String(id);

                }
            );


        if (!account) {

            return;

        }


        document.getElementById(
            "editingAccountId"
        ).value =
            accountId(account);


        document.getElementById(
            "accountNameInput"
        ).value =
            accountName(account);


        document.getElementById(
            "accountTargetInput"
        ).value =
            Number(
                account.target
            ) || 0;


        document.getElementById(
            "accountFormTitle"
        ).textContent =
            "Edit Akun";


        document.getElementById(
            "saveAccountButton"
        ).textContent =
            "Simpan Perubahan";


        document.getElementById(
            "cancelAccountEditButton"
        ).style.display =
            "inline-block";

    }


    // =====================================
    // DELETE ACCOUNT
    // =====================================

    function deleteAccount(id) {

        const accounts =
            getAccounts();


        const account =
            accounts.find(
                function (item) {

                    return String(
                        accountId(item)
                    )
                    ===
                    String(id);

                }
            );


        if (!account) {

            return;

        }


        const name =
            accountName(account);


        const hasTransaction =
            getTransactions().some(
                function (transaction) {

                    return String(
                        transactionAccountId(
                            transaction
                        )
                    )
                    ===
                    String(id);

                }
            );


        if (hasTransaction) {

            alert(
                "Akun tidak dapat dihapus karena sudah memiliki transaksi."
            );

            return;

        }


        if (
            !confirm(
                `Hapus akun "${name}"?`
            )
        ) {

            return;

        }


        saveAccounts(

            accounts.filter(
                function (item) {

                    return String(
                        accountId(item)
                    )
                    !==
                    String(id);

                }
            )

        );


        renderSettings();

    }


    // =====================================
    // SAVE BUDGET CATEGORY
    // =====================================

    function saveBudgetCategory() {

        const name =
            document.getElementById(
                "budgetNameInput"
            )?.value.trim();

        const percentage =
            Number(
                document.getElementById(
                    "budgetPercentageInput"
                )?.value
            );

        const editingId =
            document.getElementById(
                "editingBudgetId"
            )?.value;


        if (!name) {

            alert(
                "Nama kategori harus diisi."
            );

            return;

        }


        if (
            Number.isNaN(percentage) ||
            percentage < 0 ||
            percentage > 100
        ) {

            alert(
                "Persentase harus antara 0 sampai 100."
            );

            return;

        }


        const budget =
            getBudgetData();


        let total =
            budget.recommendations.reduce(
                function (sum, item) {

                    return sum +
                        (
                            Number(
                                item.percentage
                            ) || 0
                        );

                },
                0
            );


        // Jika edit, keluarkan persentase lama
        if (editingId) {

            const old =
                budget.recommendations.find(
                    function (item) {

                        return String(
                            item.id
                        )
                        ===
                        String(editingId);

                    }
                );


            if (old) {

                total -=
                    Number(
                        old.percentage
                    ) || 0;

            }

        }


        if (
            total +
            percentage >
            100
        ) {

            alert(
                "Total persentase tidak boleh lebih dari 100%."
            );

            return;

        }


        if (editingId) {

            const item =
                budget.recommendations.find(
                    function (category) {

                        return String(
                            category.id
                        )
                        ===
                        String(editingId);

                    }
                );


            if (item) {

                item.name =
                    name;

                item.percentage =
                    percentage;

            }

        }

        else {

            budget.recommendations.push({

                id:
                    Date.now().toString(),

                name:
                    name,

                percentage:
                    percentage,

                actual:
                    0

            });

        }


        saveBudgetData(
            budget
        );


        renderSettings();

    }


    // =====================================
    // EDIT BUDGET CATEGORY
    // =====================================

    function editBudgetCategory(id) {

        const budget =
            getBudgetData();


        const item =
            budget.recommendations.find(
                function (category) {

                    return String(
                        category.id
                    )
                    ===
                    String(id);

                }
            );


        if (!item) {

            return;

        }


        document.getElementById(
            "editingBudgetId"
        ).value =
            item.id;


        document.getElementById(
            "budgetNameInput"
        ).value =
            item.name;


        document.getElementById(
            "budgetPercentageInput"
        ).value =
            item.percentage;


        document.getElementById(
            "budgetFormTitle"
        ).textContent =
            "Edit Kategori";


        document.getElementById(
            "saveBudgetButton"
        ).textContent =
            "Simpan Perubahan";


        document.getElementById(
            "cancelBudgetButton"
        ).style.display =
            "inline-block";

    }


    // =====================================
    // DELETE BUDGET CATEGORY
    // =====================================

    function deleteBudgetCategory(id) {

        const budget =
            getBudgetData();


        const item =
            budget.recommendations.find(
                function (category) {

                    return String(
                        category.id
                    )
                    ===
                    String(id);

                }
            );


        if (!item) {

            return;

        }


        if (
            !confirm(
                `Hapus kategori "${item.name}"?`
            )
        ) {

            return;

        }


        budget.recommendations =
            budget.recommendations.filter(
                function (category) {

                    return String(
                        category.id
                    )
                    !==
                    String(id);

                }
            );


        saveBudgetData(
            budget
        );


        renderSettings();

    }


    // =====================================
    // SAVE DASHBOARD SETTINGS
    // =====================================

    function saveDashboardSettings() {

        const preferences =
            getPreferences() || {};


        document
            .querySelectorAll(
                ".dashboard-setting"
            )
            .forEach(
                function (checkbox) {

                    preferences[
                        checkbox.dataset.key
                    ] =
                        checkbox.checked;

                }
            );


        savePreferences(
            preferences
        );

    }


    // =====================================
    // DEBUG
    // =====================================

    console.log(
        "Personal Saving Dashboard loaded."
    );

    console.log(
        "Accounts:",
        getAccounts()
    );

    console.log(
        "Transactions:",
        getTransactions()
    );

    console.log(
        "Budgets:",
        getBudgets()
    );

    console.log(
        "Preferences:",
        getPreferences()
    );


    // =====================================
    // START
    // =====================================

    openPage(
        "dashboard"
    );

});