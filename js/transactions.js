// =====================================
// TRANSACTIONS
// INPUT TABUNGAN
// =====================================


// =====================================
// RENDER TRANSACTIONS PAGE
// =====================================

function renderTransactions() {

    const app = document.getElementById("app");

    const accounts = getAccounts();
    const transactions = getTransactions();


    // =================================
    // HEADER
    // =================================

    let html = `

        <div class="page-header">

            <h2>
                Input Tabungan
            </h2>

            <p>
                Catat setiap uang yang Anda masukkan ke tabungan.
            </p>

        </div>

    `;


    // =================================
    // JIKA BELUM ADA AKUN
    // =================================

    if (accounts.length === 0) {

        html += `

            <div class="empty-state">

                <div class="empty-icon">
                    🏦
                </div>

                <h3>
                    Belum ada akun tabungan
                </h3>

                <p>
                    Tambahkan akun tabungan terlebih dahulu
                    melalui menu Setting.
                </p>

                <button
                    class="primary-button"
                    id="goToSettings">

                    + Tambah Akun

                </button>

            </div>

        `;

        app.innerHTML = html;


        document
            .getElementById("goToSettings")
            .addEventListener(
                "click",
                function () {

                    renderSettings();

                    updateActiveNavigation("settings");

                    const pageTitle =
                        document.getElementById("pageTitle");

                    if (pageTitle) {
                        pageTitle.textContent = "Setting";
                    }

                }
            );

        return;
    }


    // =================================
    // FORM INPUT TABUNGAN
    // =================================

    html += `

        <div class="form-container">

            <form id="transactionForm">

                <div class="form-group">

                    <label for="transactionAccount">
                        Akun Tabungan
                    </label>

                    <select
                        id="transactionAccount"
                        required>

    `;


    accounts.forEach(account => {

        html += `

            <option value="${account.id}">
                ${escapeHTML(account.name)}
            </option>

        `;

    });


    html += `

                    </select>

                </div>


                <div class="form-group">

                    <label for="transactionAmount">
                        Jumlah Tabungan
                    </label>

                    <input
                        type="number"
                        id="transactionAmount"
                        placeholder="Contoh: 500000"
                        min="1"
                        step="1"
                        required>

                </div>


                <div class="form-group">

                    <label for="transactionDate">
                        Tanggal
                    </label>

                    <input
                        type="date"
                        id="transactionDate"
                        value="${getTodayDate()}"
                        required>

                </div>


                <div class="form-group">

                    <label for="transactionDescription">
                        Keterangan
                    </label>

                    <input
                        type="text"
                        id="transactionDescription"
                        placeholder="Contoh: Tabungan bulan Agustus"
                        maxlength="150">

                </div>


                <button
                    type="submit"
                    class="primary-button">

                    + Simpan Tabungan

                </button>

            </form>

        </div>

    `;


    // =================================
    // RIWAYAT TABUNGAN
    // =================================

    html += `

        <div class="transaction-history">

            <h2>
                Riwayat Tabungan
            </h2>

    `;


    if (transactions.length === 0) {

        html += `

            <div class="empty-state">

                <div class="empty-icon">
                    📝
                </div>

                <h3>
                    Belum ada transaksi
                </h3>

                <p>
                    Transaksi tabungan yang Anda simpan
                    akan muncul di sini.
                </p>

            </div>

        `;

    } else {

        // Urutkan terbaru terlebih dahulu
        const sortedTransactions =
            [...transactions].sort(
                (a, b) =>
                    new Date(b.date) - new Date(a.date)
            );


        html += `

            <div class="transaction-list">

        `;


        sortedTransactions.forEach(transaction => {

            const account =
                accounts.find(
                    item =>
                        String(item.id) ===
                        String(transaction.accountId)
                );


            const accountName =
                account
                    ? account.name
                    : "Akun tidak ditemukan";


            html += `

                <div class="transaction-card">

                    <div class="transaction-info">

                        <div class="transaction-icon">
                            💰
                        </div>

                        <div>

                            <h3>
                                ${escapeHTML(accountName)}
                            </h3>

                            <p>
                                ${formatDate(transaction.date)}
                            </p>

                            ${
                                transaction.description
                                    ? `
                                        <p>
                                            ${escapeHTML(
                                                transaction.description
                                            )}
                                        </p>
                                      `
                                    : ""
                            }

                        </div>

                    </div>


                    <div class="transaction-right">

                        <strong>
                            + ${formatCurrency(
                                transaction.amount
                            )}
                        </strong>


                        <button
                            class="delete-transaction"
                            data-id="${transaction.id}">

                            Hapus

                        </button>

                    </div>

                </div>

            `;

        });


        html += `

            </div>

        `;

    }


    html += `</div>`;


    // =================================
    // TAMPILKAN
    // =================================

    app.innerHTML = html;


    // =================================
    // FORM SUBMIT
    // =================================

    const form =
        document.getElementById(
            "transactionForm"
        );


    if (form) {

        form.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                saveTransaction();

            }
        );

    }


    // =================================
    // DELETE TRANSACTION
    // =================================

    document
        .querySelectorAll(
            ".delete-transaction"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    const id =
                        button.dataset.id;

                    deleteTransaction(id);

                }
            );

        });

}


// =====================================
// SAVE TRANSACTION
// =====================================

function saveTransaction() {

    const accountId =
        document
            .getElementById(
                "transactionAccount"
            )
            .value;


    const amount =
        Number(
            document
                .getElementById(
                    "transactionAmount"
                )
                .value
        );


    const date =
        document
            .getElementById(
                "transactionDate"
            )
            .value;


    const description =
        document
            .getElementById(
                "transactionDescription"
            )
            .value
            .trim();


    // =================================
    // VALIDASI
    // =================================

    if (!accountId) {

        alert(
            "Silakan pilih akun tabungan."
        );

        return;

    }


    if (!amount || amount <= 0) {

        alert(
            "Jumlah tabungan harus lebih dari 0."
        );

        return;

    }


    if (!date) {

        alert(
            "Tanggal harus diisi."
        );

        return;

    }


    // =================================
    // CEK AKUN
    // =================================

    const accounts =
        getAccounts();


    const account =
        accounts.find(
            item =>
                String(item.id) ===
                String(accountId)
        );


    if (!account) {

        alert(
            "Akun tabungan tidak ditemukan."
        );

        return;

    }


    // =================================
    // BUAT TRANSAKSI
    // =================================

    const transactions =
        getTransactions();


    const newTransaction = {

        id:
            Date.now().toString(),

        accountId:
            accountId,

        amount:
            amount,

        date:
            date,

        description:
            description

    };


    transactions.push(
        newTransaction
    );


    // =================================
    // SIMPAN
    // =================================

    saveTransactions(
        transactions
    );


    // =================================
    // NOTIFIKASI
    // =================================

    alert(
        "Tabungan berhasil disimpan."
    );


    // =================================
    // REFRESH HALAMAN
    // =================================

    renderTransactions();

}


// =====================================
// DELETE TRANSACTION
// =====================================

function deleteTransaction(
    transactionId
) {

    const confirmed =
        confirm(
            "Apakah Anda yakin ingin menghapus transaksi ini?"
        );


    if (!confirmed) {

        return;

    }


    let transactions =
        getTransactions();


    transactions =
        transactions.filter(
            transaction =>
                String(transaction.id) !==
                String(transactionId)
        );


    saveTransactions(
        transactions
    );


    renderTransactions();

}


// =====================================
// TODAY DATE
// =====================================

function getTodayDate() {

    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            today.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


// =====================================
// FORMAT DATE
// =====================================

function formatDate(dateString) {

    if (!dateString) {

        return "-";

    }


    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return new Intl.DateTimeFormat(
        "id-ID",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    ).format(date);

}


// =====================================
// ESCAPE HTML
// =====================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}