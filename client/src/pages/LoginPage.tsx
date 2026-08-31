import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/authClient";
import { FormInput } from "../components/shared/FormInput";

function LoginPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await login(form.email, form.password);
            navigate("/invoices");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="details-section" style={{ maxWidth: 400, margin: "40px auto" }}>
            <p className="details-section-title">Log in</p>

            <form onSubmit={handleSubmit}>
                <FormInput
                    name="email"
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                />
                <FormInput
                    name="password"
                    label="Password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                />

                {error && <p className="field-error">{error}</p>}

                <button type="submit" className="btn-edit" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in..." : "Log in"}
                </button>
            </form>

            <p style={{ marginTop: 12 }}>
                Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
        </div>
    );
}

export default LoginPage;