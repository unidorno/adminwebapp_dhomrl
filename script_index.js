let tg = window.Telegram.WebApp;

Telegram.WebApp.ready();
configureThemeColor(Telegram.WebApp.colorScheme);
tg.expand();

if (window.Telegram.WebApp.initDataUnsafe.user.id !== 1842088012 && window.Telegram.WebApp.initDataUnsafe.user.id !== 338134907) {
    window.Telegram.WebApp.close();
}
document.querySelector('.index_menu_b').onclick = function () {
    location.href = "menu.html";
};
document.querySelector('.index_clients_b').onclick = function () {
    location.href = "clients.html";
};
document.querySelector('.index_orders_b').onclick = function () {
    location.href = "orders.html";
};
document.querySelector('.index_settings_b').onclick = function () {
    location.href = "settings.htlm";
};
