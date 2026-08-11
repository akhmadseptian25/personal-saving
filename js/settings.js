// =====================================
// SETTINGS
// ACCOUNT MANAGEMENT
// =====================================

function renderSettings() {

    const app = document.getElementById("app");

    const accounts = getAccounts();

    // =================================
    // HEADER
    // =================================

    let html = `
        <div class="settings-header">

            <div>
                <h2>Akun Tabungan</h2>

                <p>
                    Kelola akun dan target tabungan Anda.
                </p>
            </div>

            <button
                class="primary-button"
                id="addAccountButton">
                + Tambah Akun
            </button>

        </div>
    `;


    // =================================
    // ACCOUNT LIST
    // =================================

    if (accounts.length === 0) {

        html += `
            <div class="empty-state">

                <div class="empty-icon">
                    💰
                </div>

                <h3>Belum ada akun</h3>

                <p>
                    Tambahkan akun tabungan pertama Anda.
                </p>

                <button
                    class="primary-button"
                    id="addAccountButtonEmpty">
                    + Tambah Akun
                </button>

            </div>
        `;

    } else {

        html += `
            <div class="account-list">
        `;


        accounts.forEach(account => {

            html += `
                <div class="account-card">

                    <div class="account-info">

                        <div class="account-icon">
                            🏦
                        </div>

                        <div>

                            <h3>
                                ${account.name}
                            </h3>

                            <p>
                                Target:
                                ${formatCurrency(account.target)}
                            </p>

                        </div>

                    </div>


                    <div class="account-actions">

                        <button
                            class="edit-account"
                            data-id="${account.id}">
                            Edit
                        </button>


                        <button
                            class="delete-account"
                            data-id="${account.id}">
                            Hapus
                        </button>

                    </div>

                </div>
            `;

        });


        html += `</div>`;

    }


    app.innerHTML = html;


    // =================================
    // ADD ACCOUNT BUTTON
    // =================================

    const addButton =
        document.getElementById("addAccountButton");

    const addButtonEmpty =
        document.getElementById("addAccountButtonEmpty");


    if (addButton) {

            addButton.addEventListener(
                "click",
                () => showAccountForm()
            );
        
    }


    if (addButtonEmpty) {

        addButtonEmpty.addEventListener(
            "click",
            () => showAccountForm()
        );
    
    }


    // =================================
    // EDIT ACCOUNT
    // =================================

    document
        .querySelectorAll(".edit-account")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        button.dataset.id;

                    showAccountForm(id);

                }
            );

        });


    // =================================
    // DELETE ACCOUNT
    // =================================

    document
        .querySelectorAll(".delete-account")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        button.dataset.id;

                    deleteAccount(id);

                }
            );

        });

}


// =====================================
// ACCOUNT FORM
// =====================================

function showAccountForm(accountId = null) {

    const app = document.getElementById("app");

    const accounts = getAccounts();

    let account = null;


    if (accountId) {

        account =
            accounts.find(
                item => item.id === accountId
            );

    }


    const isEdit =
        account !== null;


    app.innerHTML = `

        <div class="form-container">

            <div class="form-header">

                <button
                    class="back-button"
                    id="backToSettings">

                    ← Kembali

                </button>

                <h2>
                    ${isEdit
                        ? "Edit Akun"
                        : "Tambah Akun"}
                </h2>

            </div>


            <form id="accountForm">

                <div class="form-group">

                    <label>
                        Nama Akun
                    </label>

                    <input
                        type="text"
                        id="accountName"
                        placeholder="Contoh: Tabungan BCA"
                        value="${isEdit
                            ? account.name
                            : ""}"
                        required>

                </div>


                <div class="form-group">

                    <label>
                        Target Tabungan
                    </label>

                    <input
                        type="number"
                        id="accountTarget"
                        placeholder="Contoh: 10000000"
                        min="0"
                        value="${isEdit
                            ? account.target
                            : ""}"
                        required>

                </div>


                <button
                    type="submit"
                    class="primary-button">

                    Simpan Akun

                </button>

            </form>

        </div>

    `;


    // =================================
    // BACK
    // =================================

    document
        .getElementById("backToSettings")
        .addEventListener(
            "click",
            renderSettings
        );


    // =================================
    // FORM SUBMIT
    // =================================

    document
        .getElementById("accountForm")
        .addEventListener(
            "submit",
            event => {

                event.preventDefault();

                saveAccount(accountId);

            }
        );

}


// =====================================
// SAVE ACCOUNT
// =====================================

function saveAccount(accountId) {

    const accounts = getAccounts();


    const name =
        document
            .getElementById("accountName")
            .value
            .trim();


    const target =
        Number(
            document
                .getElementById("accountTarget")
                .value
        );


    if (!name) {

        alert("Nama akun harus diisi.");

        return;

    }


    if (target < 0) {

        alert("Target tidak boleh negatif.");

        return;

    }


    // =================================
    // EDIT
    // =================================

    if (accountId) {

        const index =
            accounts.findIndex(
                item => item.id === accountId
            );


        if (index !== -1) {

            accounts[index].name =
                name;

            accounts[index].target =
                target;

        }

    }


    // =================================
    // NEW ACCOUNT
    // =================================

    else {

        const newAccount = {

            id:
                Date.now().toString(),

            name:
                name,

            target:
                target

        };


        accounts.push(newAccount);

    }


    // Simpan
    saveAccounts(accounts);


    // Kembali ke setting
    renderSettings();

}


// =====================================
// DELETE ACCOUNT
// =====================================

function deleteAccount(accountId) {

    const confirmed =
        confirm(
            "Apakah Anda yakin ingin menghapus akun ini?"
        );


    if (!confirmed) {

        return;

    }


    let accounts = getAccounts();


    accounts =
        accounts.filter(
            account => account.id !== accountId
        );


    saveAccounts(accounts);


    renderSettings();

}


// =====================================
// CURRENCY FORMAT
// =====================================

function formatCurrency(value) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }
    ).format(value);

}