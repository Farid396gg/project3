document.addEventListener('DOMContentLoaded', async () => {
    const fromCurrencyButtons = document.querySelectorAll('#fromConverter .currency');
    const toCurrencyButtons = document.querySelectorAll('#toConverter .currency');
    const fromAmountInput = document.getElementById('fromAmountInput');
    const toAmountInput = document.getElementById('toAmountInput');
    const conversionResult = document.getElementById('conversionResult');
    const apiUrl = 'https://v6.exchangerate-api.com/v6/509dc80809614f5159f1b123/latest/';

    const convertCurrency = async () => {
        const fromCurrencyElement = document.querySelector('#fromConverter .currency.selected');
        const toCurrencyElement = document.querySelector('#toConverter .currency.selected');
        const amount = fromAmountInput.value.trim();
        if (!amount || !fromCurrencyElement || !toCurrencyElement) return;

        const fromCurrency = fromCurrencyElement.textContent;
        const toCurrency = toCurrencyElement.textContent;

       
        if (fromCurrency === toCurrency) {
            toAmountInput.value = fromAmountInput.value;
            return; 
        }

    
        if (!navigator.onLine) {
            conversionResult.textContent = 'Ошибка:нет интернет-соединения';
            return;
        }

        try {
            const response = await fetch(`${apiUrl}${fromCurrency}`);
            const data = await response.json();
            if (!data || !data.conversion_rates || !data.conversion_rates[toCurrency]) throw new Error('Неверная структура данных или отсутствует обменный курс');

            const exchangeRateFrom = data.conversion_rates[fromCurrency];
            const exchangeRateTo = data.conversion_rates[toCurrency];
            const convertedAmount = (amount * exchangeRateTo) / exchangeRateFrom;
            toAmountInput.value = convertedAmount.toFixed(2);

            const fromCurrencyValue = exchangeRateTo;
            const toCurrencyValue = 1 / exchangeRateTo;
            document.getElementById('fromCurrencyValue').textContent = `1 ${fromCurrency} = ${fromCurrencyValue.toFixed(4)} ${toCurrency}`;
            document.getElementById('toCurrencyValue').textContent = `1 ${toCurrency} = ${toCurrencyValue.toFixed(4)} ${fromCurrency}`;
        } catch (error) {
            console.error('Ошибка при получении обменного курса:', error);
            conversionResult.textContent = 'Ошибка при получении обменного курса.';
        }
    };

    const selectCurrency = (buttons, currency) => {
        buttons.forEach(btn => btn.classList.remove('selected'));
        currency.classList.add('selected');
        convertCurrency();
    };

    fromCurrencyButtons.forEach(button => button.addEventListener('click', () => selectCurrency(fromCurrencyButtons, button)));
    toCurrencyButtons.forEach(button => button.addEventListener('click', () => selectCurrency(toCurrencyButtons, button)));

    fromAmountInput.addEventListener('input', () => {
        if (!fromAmountInput.value.trim()) toAmountInput.value = ''; 
        convertCurrency();
    });

    document.querySelector('#fromConverter .currency:nth-child(1)').click();
    document.querySelector('#toConverter .currency:nth-child(4)').click();
});
