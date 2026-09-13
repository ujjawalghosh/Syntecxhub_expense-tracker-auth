import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BarChart3,
  ChevronRight,
  CircleDollarSign,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  ReceiptText,
  Settings2,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const API = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
const categoryColors = {
  Food: "#f09a73",
  Transport: "#7d9be8",
  Shopping: "#bf9bdb",
  Bills: "#80c8ad",
  Health: "#e7bd68",
  Other: "#94a3b8",
};
const money = (value) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    value,
  );
const dateLabel = (value) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(
    new Date(value),
  );

function Auth({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const emailRef = useRef(null);
  useEffect(() => emailRef.current?.focus(), [mode]);
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!form.email || !form.password || (mode === "signup" && !form.name))
      return setError("Please complete every field.");
    try {
      const response = await fetch(`${API}/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok)
        throw new Error(
          (await response.json()).message || "Unable to authenticate",
        );
      onAuth(await response.json());
    } catch (requestError) {
      setError(
        requestError.message.includes("fetch")
          ? "Backend is unavailable. Start the backend and make sure MongoDB is connected."
          : requestError.message,
      );
    }
  };
  return (
    <main className="auth-page">
      <div className="auth-art">
        <div className="art-orbit orbit-one" />
        <div className="art-orbit orbit-two" />
        <div className="art-copy">
          <span className="brand-mark">
            <CircleDollarSign size={20} />
          </span>
          <p className="eyebrow">A clearer view of your money</p>
          <h1>Make space for what matters.</h1>
          <p>
            Track the little things, understand the big picture, and spend with
            more intention.
          </p>
          <div className="art-stat">
            <span>
              <TrendingDown size={16} /> spending down
            </span>
            <strong>12.8%</strong>
          </div>
        </div>
      </div>
      <section className="auth-panel">
        <div className="auth-header">
          <div className="brand dark-brand">
            <CircleDollarSign size={19} /> spendly
          </div>
          <span className="auth-badge">
            <Sparkles size={13} /> friendly finances
          </span>
        </div>
        <div className="auth-heading">
          <p className="eyebrow">
            {mode === "login" ? "Welcome back" : "Start fresh"}
          </p>
          <h2>
            {mode === "login"
              ? "Your money, in focus."
              : "Build a better rhythm."}
          </h2>
          <p>
            {mode === "login"
              ? "Sign in to continue to your personal spending space."
              : "Create your account in less than a minute."}
          </p>
        </div>
        <form onSubmit={submit}>
          {mode === "signup" && (
            <label>
              Full name
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Alex Morgan"
              />
            </label>
          )}
          <label>
            Email address
            <input
              ref={emailRef}
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 6 characters"
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="primary-button" type="submit">
            {mode === "login" ? "Enter my dashboard" : "Create my account"}
            <ChevronRight size={17} />
          </button>
        </form>
        <p className="auth-switch">
          {mode === "login" ? "New to Spendly?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError("");
            }}
          >
            {mode === "login" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </section>
    </main>
  );
}

function Navbar({ active, setActive, user, logout }) {
  const [open, setOpen] = useState(false);
  const items = [
    ["dashboard", "Overview", LayoutDashboard],
    ["add", "Add expense", Plus],
    ["reports", "Reports", BarChart3],
  ];
  return (
    <header className="navbar">
      <div className="nav-inner">
        <div className="brand">
          <CircleDollarSign size={21} /> spendly
        </div>
        <nav className={open ? "mobile-open" : ""}>
          {items.map(([key, label, Icon]) => (
            <button
              key={key}
              className={active === key ? "nav-link active" : "nav-link"}
              onClick={() => {
                setActive(key);
                setOpen(false);
              }}
            >
              <Icon size={17} /> {label}
            </button>
          ))}
        </nav>
        <div className="nav-actions">
          <button className="icon-button">
            <Settings2 size={18} />
          </button>
          <div className="avatar">
            {(user?.name || "A").slice(0, 1).toUpperCase()}
          </div>
          <button className="logout-button" onClick={logout}>
            <LogOut size={16} /> <span>Log out</span>
          </button>
          <button className="menu-button" onClick={() => setOpen(!open)}>
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>
    </header>
  );
}

function Dashboard({ expenses, setActive, user }) {
  const incomeTotal = useMemo(
    () => expenses.reduce((sum, item) => sum + (item.type === "income" ? Number(item.amount) : 0), 0),
    [expenses],
  );
  const expenseTotal = useMemo(
    () => expenses.reduce((sum, item) => sum + (item.type === "income" ? 0 : Number(item.amount)), 0),
    [expenses],
  );
  const total = incomeTotal - expenseTotal;
  const categoryData = useMemo(
    () =>
      Object.entries(
        expenses.filter((item) => item.type !== "income").reduce(
          (result, item) => ({
            ...result,
            [item.category]: (result[item.category] || 0) + Number(item.amount),
          }),
          {},
        ),
      ).map(([name, value]) => ({ name, value })),
    [expenses],
  );
  const trend = [
    { day: "Mon", amount: 42 },
    { day: "Tue", amount: 74 },
    { day: "Wed", amount: 56 },
    { day: "Thu", amount: 91 },
    { day: "Fri", amount: 48 },
    { day: "Sat", amount: 106 },
    { day: "Sun", amount: 66 },
  ];
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Sunday, September 13, 2026</p>
          <h1>
            Good morning, {user?.name?.split(" ")[0] || "Alex"}{" "}
            <span className="wave">✦</span>
          </h1>
          <p className="muted">Here’s your financial pulse for the week.</p>
        </div>
        <button
          className="primary-button compact"
          onClick={() => setActive("add")}
        >
          <Plus size={17} /> Add expense
        </button>
      </div>
      <div className="stat-grid">
        <div className="stat-card highlight">
          <div className="stat-icon">
            <Wallet size={19} />
          </div>
          <span>Net balance</span>
          <strong>{money(total)}</strong>
          <small>
            <TrendingUp size={14} /> Income {money(incomeTotal)} · Spent {money(expenseTotal)}
          </small>
        </div>
        <div className="stat-card">
          <div className="stat-icon mint">
            <TrendingUp size={19} />
          </div>
          <span>Avg. daily spend</span>
          <strong>{money(expenseTotal / 7)}</strong>
          <small className="neutral">Your calmest day is Sunday</small>
        </div>
        <div className="stat-card">
          <div className="stat-icon lilac">
            <ReceiptText size={19} />
          </div>
          <span>Transactions</span>
          <strong>{expenses.length}</strong>
          <small className="neutral">
            Across {categoryData.length} categories
          </small>
        </div>
      </div>
      <div className="dashboard-grid">
        <section className="panel trend-panel">
          <div className="panel-heading">
            <div>
              <h3>Spending rhythm</h3>
              <p>Daily overview · This week</p>
            </div>
            <button className="select-button">
              This week <ChevronRight size={15} />
            </button>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f09a73" stopOpacity=".3" />
                    <stop offset="100%" stopColor="#f09a73" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#eeeae3" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#a0a19c", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#a0a19c", fontSize: 12 }}
                  tickFormatter={(value) => `₹${value}`}
                  width={42}
                />
                <Tooltip
                  formatter={(value) => money(value)}
                  contentStyle={{
                    border: 0,
                    borderRadius: 10,
                    boxShadow: "0 8px 24px #2d2f2d18",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#e77e53"
                  strokeWidth={3}
                  fill="url(#spendFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="panel category-panel">
          <div className="panel-heading">
            <div>
              <h3>Where it goes</h3>
              <p>By category</p>
            </div>
            <button className="more-button">•••</button>
          </div>
          <div className="donut-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={52}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={categoryColors[entry.name] || categoryColors.Other}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => money(value)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-total">
              <strong>{money(expenseTotal)}</strong>
              <span>Total</span>
            </div>
          </div>
          <div className="legend">
            {categoryData.slice(0, 4).map((entry) => (
              <span key={entry.name}>
                <i style={{ background: categoryColors[entry.name] }} />
                {entry.name}
                <b>{Math.round((entry.value / total) * 100)}%</b>
              </span>
            ))}
          </div>
        </section>
      </div>
      <section className="panel recent-panel">
        <div className="panel-heading">
          <div>
            <h3>Recent activity</h3>
            <p>Your latest transactions</p>
          </div>
          <button className="text-button" onClick={() => setActive("reports")}>
            View all <ChevronRight size={15} />
          </button>
        </div>
        <ExpenseList expenses={expenses.slice(0, 4)} />
      </section>
    </>
  );
}

function ExpenseList({ expenses, onDelete }) {
  return (
    <div className="expense-list">
      {expenses.map((expense) => (
        <div className="expense-row" key={expense._id}>
          <div
            className="expense-category"
            style={{
              background: `${categoryColors[expense.category] || "#94a3b8"}22`,
              color: categoryColors[expense.category] || "#94a3b8",
            }}
          >
            <CreditCard size={18} />
          </div>
          <div className="expense-name">
            <strong>{expense.title}</strong>
            <span>
              {expense.category} · {dateLabel(expense.date)}
            </span>
          </div>
          <strong className="expense-amount">
            {expense.type === "income" ? "+" : "-"}{money(Number(expense.amount))}
          </strong>
          {onDelete && (
            <button
              className="delete-button"
              onClick={() => onDelete(expense._id)}
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function AddExpense({ onAdd, setActive }) {
  const titleRef = useRef(null);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "Food",
    date: new Date().toISOString().slice(0, 10),
    note: "",
  });
  useEffect(() => titleRef.current?.focus(), []);
  const update = useCallback(
    (key, value) => setForm((current) => ({ ...current, [key]: value })),
    [],
  );
  const submit = (e) => {
    e.preventDefault();
    if (!form.title || !form.amount) return;
    onAdd({ ...form, amount: Number(form.amount), _id: crypto.randomUUID() });
    setActive("dashboard");
  };
  return (
    <div className="form-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">New transaction</p>
          <h1>Add money movement</h1>
          <p className="muted">Record an expense or add your income/profit.</p>
        </div>
      </div>
      <form className="panel expense-form" onSubmit={submit}>
        <div className="form-intro">
          <div className="big-form-icon">
            <Plus size={24} />
          </div>
          <div>
            <h3>Tell us about it</h3>
            <p>It only takes a moment to keep your picture clear.</p>
          </div>
        </div>
        <div className="form-grid">
          <label>
            Transaction type
            <select value={form.type} onChange={(e) => update("type", e.target.value)}>
              <option value="expense">Expense</option>
              <option value="income">Income / Profit</option>
            </select>
          </label>
          <label>
            What is this for?
            <input
              ref={titleRef}
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Morning coffee"
            />
          </label>
          <label>
            Amount
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => update("amount", e.target.value)}
              placeholder="0.00"
            />
          </label>
          <label>
            Category
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
            >
              {Object.keys(categoryColors).map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
          <label>
            Date
            <input
              type="date"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
            />
          </label>
          <label className="full-field">
            Note <span className="optional">Optional</span>
            <textarea
              value={form.note}
              onChange={(e) => update("note", e.target.value)}
              placeholder="Add a little context..."
            />
          </label>
        </div>
        <div className="form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => setActive("dashboard")}
          >
            Cancel
          </button>
          <button className="primary-button" type="submit">
            Save expense <ChevronRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}

function Reports({ expenses, onDelete }) {
  const incomeTotal = expenses.reduce(
    (sum, item) => sum + (item.type === "income" ? Number(item.amount) : 0),
    0,
  );
  const expenseTotal = expenses.reduce(
    (sum, item) => sum + (item.type === "income" ? 0 : Number(item.amount)),
    0,
  );
  const total = incomeTotal - expenseTotal;
  const byCategory = Object.entries(
    expenses.filter((item) => item.type !== "income").reduce(
      (result, item) => ({
        ...result,
        [item.category]: (result[item.category] || 0) + Number(item.amount),
      }),
      {},
    ),
  )
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
  const dailyData = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      const key = date.toISOString().slice(0, 10);
      const amount = expenses
        .filter((item) => item.type !== "income" && item.date?.slice(0, 10) === key)
        .reduce((sum, item) => sum + Number(item.amount), 0);
      return {
        label: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date),
        amount,
      };
    });
  }, [expenses]);
  const maxDailyAmount = Math.max(...dailyData.map((day) => day.amount), 1);
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">A little perspective</p>
          <h1>Your reports</h1>
          <p className="muted">
            Understand your habits and make your next choice easier.
          </p>
        </div>
        <div className="report-date">
          September 2026 <ChevronRight size={15} />
        </div>
      </div>
      <div className="report-grid">
        <div className="report-hero">
          <span>Net balance</span>
          <strong>{money(total)}</strong>
          <p>
            <TrendingUp size={15} /> Income {money(incomeTotal)} · Spent {money(expenseTotal)}
          </p>
          <div className="mini-bars">
            {dailyData.map((day) => (
              <i
                key={day.label}
                title={`${day.label}: ${money(day.amount)}`}
                style={{ height: `${Math.max((day.amount / maxDailyAmount) * 100, day.amount ? 8 : 2)}%` }}
              />
            ))}
          </div>
        </div>
        <section className="panel breakdown">
          <div className="panel-heading">
            <div>
              <h3>Category breakdown</h3>
              <p>Where your money went</p>
            </div>
          </div>
          {byCategory.length ? (
            <ResponsiveContainer width="100%" height={190}>
              <BarChart
                data={byCategory}
                layout="vertical"
                margin={{ left: 10, right: 20 }}
              >
                <CartesianGrid horizontal={false} stroke="#eeeae3" />
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#656862", fontSize: 12 }}
                  width={70}
                />
                <Bar dataKey="amount" radius={[0, 5, 5, 0]} barSize={16}>
                  {byCategory.map((entry) => (
                    <Cell
                      key={entry.category}
                      fill={categoryColors[entry.category]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="report-empty">No expenses recorded yet.</div>
          )}
        </section>
      </div>
      <section className="panel all-expenses">
        <div className="panel-heading">
          <div>
            <h3>All expenses</h3>
            <p>{expenses.length} transactions in this period</p>
          </div>
        </div>
        <ExpenseList expenses={expenses} onDelete={onDelete} />
      </section>
    </>
  );
}

function App() {
  const [session, setSession] = useState(() =>
    (() => {
      const stored = JSON.parse(localStorage.getItem("spendly-session") || "null");
      if (stored?.token === "demo-token") {
        localStorage.removeItem("spendly-session");
        return null;
      }
      return stored;
    })(),
  );
  const [active, setActive] = useState("dashboard");
  const [expenses, setExpenses] = useState([]);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    setExpenses([]);
    if (!session) return;
    const load = async () => {
      try {
        const response = await fetch(`${API}/expenses`, {
          headers: { Authorization: `Bearer ${session.token}` },
        });
        if (!response.ok) {
          const details = await response.json().catch(() => ({}));
          const error = new Error(details.message || `Request failed (${response.status})`);
          error.status = response.status;
          throw error;
        }
        setExpenses(await response.json());
      } catch (error) {
        if (error.status === 401) {
          localStorage.removeItem("spendly-session");
          setSession(null);
          return;
        }
        setExpenses([]);
        setNotice(`Could not load expenses: ${error.message}`);
      }
    };
    load();
  }, [session]);
  const login = useCallback((value) => {
    setSession(value);
    localStorage.setItem("spendly-session", JSON.stringify(value));
  }, []);
  const logout = useCallback(() => {
    setSession(null);
    localStorage.removeItem("spendly-session");
  }, []);
  const addExpense = useCallback(
    async (expense) => {
      setExpenses((current) => [expense, ...current]);
      try {
        const { _id: temporaryId, ...expensePayload } = expense;
        const response = await fetch(`${API}/expenses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.token}`,
          },
          body: JSON.stringify(expensePayload),
        });
        if (!response.ok) {
          const details = await response.json().catch(() => ({}));
          throw new Error(details.message || `Request failed (${response.status})`);
        }
        const saved = await response.json();
        setExpenses((current) =>
          current.map((item) => (item._id === expense._id ? saved : item)),
        );
      } catch (error) {
        setExpenses((current) => current.filter((item) => item._id !== expense._id));
        setNotice(`Expense was not saved: ${error.message}`);
      }
    },
    [session],
  );
  const deleteExpense = useCallback(
    async (id) => {
      const previousExpenses = expenses;
      setExpenses((current) => current.filter((item) => item._id !== id));
      try {
        const response = await fetch(`${API}/expenses/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${session.token}` },
        });
        if (!response.ok) throw new Error();
      } catch {
        setExpenses(previousExpenses);
        setNotice("Expense could not be deleted. Nothing was removed from the database.");
      }
    },
    [expenses, session],
  );
  if (!session) return <Auth onAuth={login} />;
  return (
    <div className="app-shell">
      <Navbar
        active={active}
        setActive={setActive}
        user={session.user}
        logout={logout}
      />
      <main className="content">
        {notice && (
          <div className="app-notice">
            {notice}
            <button onClick={() => setNotice("")}>×</button>
          </div>
        )}
        {active === "dashboard" && (
          <Dashboard
            expenses={expenses}
            setActive={setActive}
            user={session.user}
          />
        )}
        {active === "add" && (
          <AddExpense onAdd={addExpense} setActive={setActive} />
        )}
        {active === "reports" && (
          <Reports expenses={expenses} onDelete={deleteExpense} />
        )}
      </main>
      <footer>
        <span>© 2026 Spendly</span>
        <span>
          Made for calmer money moments <Sparkles size={14} />
        </span>
      </footer>
    </div>
  );
}

export default App;
