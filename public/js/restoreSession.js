(async function restoreSession() {
    try {
        console.log("🔄 Restaurando sesión desde MongoDB...");

        // Restaurar localStorage si hay datos
        const localStorageData = window.sessionData.localStorage;
        if (localStorageData) {
            Object.keys(localStorageData).forEach(key => {
                localStorage.setItem(key, localStorageData[key]);
                console.log("✅ localStorage restaurado:", key);
            });
        }

        // Restaurar sessionStorage si hay datos
        const sessionStorageData = window.sessionData.sessionStorage;
        if (sessionStorageData) {
            Object.keys(sessionStorageData).forEach(key => {
                sessionStorage.setItem(key, sessionStorageData[key]);
                console.log("✅ sessionStorage restaurado:", key);
            });
        }

        // Restaurar cookies si hay datos
        const cookiesData = window.sessionData.cookies;
        if (cookiesData && Array.isArray(cookiesData)) {
            cookiesData.forEach(({ name, value }) => {
                document.cookie = `${name}=${value}; path=/; secure; samesite=lax;`;
                console.log("✅ Cookie restaurada:", name);
            });
        }

        console.log("✔️ Sesión restaurada con éxito.");

        // Intentar iniciar sesión automáticamente si la web lo permite
        await fetch("https://bocasocios.bocajuniors.com.ar/auth/login", {
            method: "GET",
            credentials: "include"
        });

        // Redirigir después de restaurar la sesión
        setTimeout(() => {
            console.log("➡️ Redirigiendo a BocaSocios...");
            window.location.href = "https://bocasocios.bocajuniors.com.ar/auth/login";
        }, 2000);
    } catch (error) {
        console.error("❌ Error restaurando sesión:", error);
    }
})();
