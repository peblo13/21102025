(function(){
  var STRIPE_PK = window.__STRIPE_PUBLISHABLE_KEY__ || '';
  var INTENT_URL = window.__PAYMENT_INTENT_URL__ || '/server/create-payment-intent.php';
  var stripe = null, elements = null, paymentElement = null;

  function qs(id){ return document.getElementById(id); }
  function setMsg(msg){ var el = qs('payment-messages'); if (el) el.textContent = msg || ''; }

  async function createIntent(amount, currency){
    try {
      var res = await fetch(INTENT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amount, currency: currency })
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.json();
    } catch (e) {
      throw e;
    }
  }

  async function ensureStripe(){
    if (!STRIPE_PK) throw new Error('Brak klucza publikowalnego Stripe. Uzupełnij w js/payments.config.js');
    if (!stripe) stripe = Stripe(STRIPE_PK);
    return stripe;
  }

  async function initElement(clientSecret){
    var s = await ensureStripe();
    elements = s.elements({ clientSecret: clientSecret, appearance: { theme: 'night', variables: { colorPrimary: '#00ff00' } } });
    paymentElement = elements.create('payment', { layout: 'tabs' });
    paymentElement.mount('#payment-element');
  }

  async function onSubmit(ev){
    ev.preventDefault();
    setMsg('Przygotowuję płatność...');

    var amtInput = qs('pay-amount');
    var curInput = qs('pay-currency');
    var amt = Math.max(1, parseInt((amtInput && amtInput.value) || '1', 10));
    var currency = (curInput && curInput.value) || 'pln';

    try {
      var intent = await createIntent(amt, currency);
      if (!intent || !intent.clientSecret) throw new Error('Brak clientSecret');
      setMsg('Ładuję metody płatności...');
      await initElement(intent.clientSecret);

      setMsg('Potwierdzam płatność...');
      var result = await stripe.confirmPayment({
        elements: elements,
        confirmParams: {
          return_url: window.location.origin + '/src/thank-you.html'
        }
      });
      if (result.error) {
        setMsg(result.error.message || 'Błąd płatności');
      } else {
        setMsg('Przekierowanie do podsumowania...');
      }
    } catch (e) {
      setMsg('Błąd: ' + (e && e.message ? e.message : e));
    }
  }

  function boot(){
    var form = qs('payment-form');
    if (form) form.addEventListener('submit', onSubmit);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();
