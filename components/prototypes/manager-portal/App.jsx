// Manager Portal — App router

const { useState: useStateApp } = React;

function App() {
  const [screen, setScreen] = useStateApp("dashboard");

  let body;
  switch (screen) {
    case "dashboard": body = <DashboardScreen go={setScreen} />; break;
    case "rooms":     body = <RoomsScreen go={setScreen} />; break;
    case "room":      body = <RoomDetailScreen go={setScreen} />; break;
    case "tenants":   body = <TenantsScreen />; break;
    case "contracts": body = <ContractsScreen />; break;
    case "payments":  body = <PaymentsScreen />; break;
    case "invoices":  body = <PlaceholderScreen title="Hóa đơn" icon="receipt_long" />; break;
    case "maint":     body = <PlaceholderScreen title="Bảo trì" icon="build" />; break;
    case "settings":  body = <PlaceholderScreen title="Cài đặt" icon="settings" />; break;
    default:          body = <DashboardScreen go={setScreen} />;
  }

  return (
    <AppShell current={screen} onNavigate={setScreen}>
      {body}
    </AppShell>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
