"use client";

import ReCAPTCHA from "react-google-recaptcha";
import { forwardRef } from "react";

const RecaptchaField = forwardRef<ReCAPTCHA, React.ComponentProps<typeof ReCAPTCHA>>(
    function RecaptchaField(props, ref) {
        return <ReCAPTCHA ref={ref} {...props} />;
    }
);

export default RecaptchaField;
