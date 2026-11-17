(function () {
  const form = document.querySelector(".inquiry-form");
  if (!form) return;

  const submitButton = form.querySelector('button[type="submit"]');
  const status = form.querySelector(".form-status");
  if (!submitButton || !status) {
    console.error("Contact form is missing its submit button or status message.");
    return;
  }

  const SERVICE_ID = "service_efwm2lu";
  const TEMPLATE_ID = "template_k6ucq85";
  const PUBLIC_KEY = "8fNyelhnQElaxQSNY";
  const buttonLabel = submitButton.textContent.trim();
  let isSending = false;

  function setStatus(message, state) {
    status.textContent = message;
    status.dataset.state = state;
  }

  if (window.emailjs) {
    window.emailjs.init({ publicKey: PUBLIC_KEY });
  } else {
    console.error("EmailJS Browser SDK v5 did not load.");
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (isSending) return;

    const invalidField = Array.from(form.querySelectorAll("[required]")).find(
      (field) =>
        field.type === "checkbox" ? !field.checked : !field.value.trim(),
    );
    if (invalidField) {
      const message =
        invalidField.id === "privacy-check"
          ? "문의 접수를 위해 개인정보 수집·이용에 동의해 주세요."
          : invalidField.id === "customer-name"
            ? "이름을 입력해 주세요."
            : "연락처를 입력해 주세요.";
      setStatus(message, "error");
      invalidField.focus();
      return;
    }

    if (!window.emailjs) {
      setStatus(
        "전송 기능을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
        "error",
      );
      return;
    }

    isSending = true;
    submitButton.disabled = true;
    submitButton.textContent = "전송 중...";
    form.setAttribute("aria-busy", "true");
    setStatus("문의 내용을 전송하고 있습니다.", "loading");

    try {
      await window.emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form);
    } catch (error) {
      console.error("EmailJS could not send the contact form.", error);
      setStatus(
        "문의 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.",
        "error",
      );
      return;
    } finally {
      isSending = false;
      submitButton.disabled = false;
      submitButton.textContent = buttonLabel;
      form.removeAttribute("aria-busy");
    }

    form.reset();
    setStatus("문의가 성공적으로 전송되었습니다. 감사합니다.", "success");
  });
})();
