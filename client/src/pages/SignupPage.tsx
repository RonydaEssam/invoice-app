import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../api/authClient";
import { FormInput } from "../components/shared/FormInput";

function SignupPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setInfo(null);
        setIsSubmitting(true);

        try {
            await signup(form.email, form.password);
            if (!localStorage.getItem("access_token")) {
                setInfo("Account created. Check your email to confirm before logging in.");
            } else {
                navigate("/invoices");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Signup failed");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="details-section" style={{ maxWidth: 400, margin: "40px auto" }}>
            <p className="details-section-title">Sign up</p>

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
                {info && <p style={{ color: "green" }}>{info}</p>}

                <button type="submit" className="btn-edit" disabled={isSubmitting}>
                    {isSubmitting ? "Signing up..." : "Sign up"}
                </button>
            </form>

            <p style={{ marginTop: 12 }}>
                Already have an account? <Link to="/login">Log in</Link>
            </p>
        </div>
    );
}

export default SignupPage;