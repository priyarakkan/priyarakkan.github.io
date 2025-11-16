function showRegister() {
    document.getElementById("loginBox").classList.add("hidden");
    document.getElementById("registerBox").classList.remove("hidden");
}

function showLogin() {
    document.getElementById("loginBox").classList.remove("hidden");
    document.getElementById("registerBox").classList.add("hidden");
}

function register() {
    let email = document.getElementById("regEmail").value;
    let pass = document.getElementById("regPass").value;
    let regMsg = document.getElementById("regMsg");

    if (!email.includes("@") || pass.length < 6) {
        regMsg.style.color = "red";
        regMsg.style.backgroundColor = "#f8d7da";
        regMsg.innerText = "Invalid email or password (min 6 chars)";
        return;
    }

    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPass", btoa(pass)); // encoded password
    regMsg.style.color = "green";
    regMsg.style.backgroundColor = "#d4edda";
    regMsg.innerText = "Account created!";
}

function login() {
    let email = document.getElementById("loginEmail").value;
    let pass = document.getElementById("loginPass").value;
    let loginMsg = document.getElementById("loginMsg");

    let storedEmail = localStorage.getItem("userEmail");
    let storedPass = localStorage.getItem("userPass");

    if (email === storedEmail && btoa(pass) === storedPass) {
        loginMsg.style.color = "green";
        loginMsg.style.backgroundColor ="#d4edda";
        loginMsg.innerText = "Login successful!";
    } else {
        loginMsg.style.color = "red";
        loginMsg.style.backgroundColor ="#f8d7da";
        loginMsg.innerText = "Invalid Email or Password!";
    }
}
