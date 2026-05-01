// ===================================================
// 1. DATA SYNC & LOCAL STORAGE (Saves & Updates UI)
// ===================================================

function saveToStorage() {
    localStorage.setItem('ff_balance', balance);
    localStorage.setItem('ff_matches', JSON.stringify(matches));
    localStorage.setItem('ff_players', JSON.stringify(players));
    localStorage.setItem('ff_tx', JSON.stringify(txHistory));
    localStorage.setItem('ff_user', currentUser);
    localStorage.setItem('ff_registered_users', JSON.stringify(registeredUsers));
    localStorage.setItem('ff_earnings', earnings);
    
    // UI elements ko instantly update karein
    if (document.getElementById('bal-txt')) {
        document.getElementById('bal-txt').innerText = balance.toFixed(2);
    }
    if (document.getElementById('wallet-bal-txt')) {
        document.getElementById('wallet-bal-txt').innerText = balance.toFixed(2);
    }
    if (document.getElementById('welcome-user')) {
        document.getElementById('welcome-user').innerText = currentUser.toUpperCase();
    }
    if (document.getElementById('prof-user')) {
        document.getElementById('prof-user').innerText = currentUser.toUpperCase();
    }
    if (document.getElementById('stat-matches')) {
        const userMatches = players.filter(p => p.username === currentUser).length;
        document.getElementById('stat-matches').innerText = userMatches;
    }
    if (document.getElementById('stat-earnings')) {
        document.getElementById('stat-earnings').innerText = "₹" + earnings.toFixed(2);
    }
    
    if (typeof renderLogs === "function") {
        renderLogs();
    }
}


// ===================================================
// 2. WALLET TAB SWITCHER & RESET (Prevents UI overlap)
// ===================================================

function switchWalletTab(tab) {
    document.getElementById('tab-dep').classList.toggle('active', tab === 'dep');
    document.getElementById('tab-wd').classList.toggle('active', tab === 'wd');
    
    document.getElementById('dep-view').classList.toggle('hidden', tab === 'wd');
    document.getElementById('wd-view').classList.toggle('hidden', tab === 'dep');

    // Reset Deposit view and Loader
    document.getElementById('wallet-main').classList.remove('hidden');
    document.getElementById('wallet-pay').classList.add('hidden');
    document.getElementById('wallet-loader').classList.add('hidden');
    
    // Reset inputs
    document.getElementById('dep-amt').value = "";
    document.getElementById('wd-amt').value = "";
    document.getElementById('wd-id').value = "";
    if (document.getElementById('upi-ref-id')) {
        document.getElementById('upi-ref-id').value = "";
    }
    if (document.getElementById('pay-progress')) {
        document.getElementById('pay-progress').style.width = "0%";
    }
}

function resetWalletUI() {
    document.getElementById('wallet-main').classList.remove('hidden');
    document.getElementById('wallet-pay').classList.add('hidden');
    document.getElementById('wallet-loader').classList.add('hidden');
    if (document.getElementById('pay-progress')) {
        document.getElementById('pay-progress').style.width = "0%";
    }
    switchWalletTab('dep');
}


// ===================================================
// 3. WITHDRAWAL LOGIC (Validation & Confirmation)
// ===================================================

function processWithdraw() {
    const amtInput = document.getElementById('wd-amt').value;
    const idInput = document.getElementById('wd-id').value.trim();
    const amt = parseFloat(amtInput);

    const MIN_WITHDRAW = 100;

    if (!amtInput || isNaN(amt) || amt <= 0) {
        return alert("❌ Please enter a valid withdrawal amount.");
    }
    if (amt < MIN_WITHDRAW) {
        return alert(`❌ Minimum withdrawal amount ₹${MIN_WITHDRAW} hai.`);
    }
    if (amt > balance) {
        return alert("❌ Insufficient balance! You cannot withdraw more than you have.");
    }
    if (!idInput) {
        return alert("❌ Please enter your UPI ID for payout.");
    }

    // Confirmation
    if (!confirm(`Are you sure you want to withdraw ₹${amt.toFixed(2)} to UPI ID: ${idInput}?`)) {
        return;
    }

    balance -= amt;
    txHistory.unshift(`- ₹${amt.toFixed(2)} Payout Pending (${idInput})`);
    
    saveToStorage();
    
    document.getElementById('wd-amt').value = "";
    document.getElementById('wd-id').value = "";
    
    alert("✅ Payout request submitted successfully! Your balance has been updated.");
}


// ===================================================
// 4. UPDATED ADMIN LOGIN (With New Password)
// ===================================================

function checkAdminLogin() {
    const passInput = document.getElementById('admin-pass-input').value;
    const correctPass = "8512092803k"; // Naya updated password

    if (passInput === correctPass) {
        alert("✅ Admin Access Granted!");
        // Admin view ko show karne ka code yahan aayega
        if (document.getElementById('admin-panel')) {
            document.getElementById('admin-panel').classList.remove('hidden');
            document.getElementById('login-panel').classList.add('hidden');
        }
    } else {
        alert("❌ Incorrect Admin Password. Access Denied.");
    }
}