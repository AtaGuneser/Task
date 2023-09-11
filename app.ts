
const filterInput = document.getElementById('filterInput') as HTMLInputElement;
const resultsList = document.getElementById('resultsList') as HTMLUListElement;
let selectedElement: HTMLLIElement | null = null;

async function queryCountries(name: string) {
    try {
        const response = await fetch('https://countries.trevorblades.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
                    query {
                        countries {
                            code
                            name
                        }
                    }
                `,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data from the GraphQL API');
        }

        const data = await response.json();

        if (!data || !data.data || !data.data.countries) {
            throw new Error('Invalid API response');
        }

        const countries = data.data.countries;

        resultsList.innerHTML = '';

        countries.forEach(country => {
            const listItem = document.createElement('li');
            listItem.textContent = `${country.name} (${country.code})`;
            listItem.classList.add('unselected');

            listItem.addEventListener('click', () => {
                if (selectedElement) {
                    selectedElement.classList.remove('selected');
                }
                listItem.classList.add('selected');
                selectedElement = listItem;
            });

            resultsList.appendChild(listItem);
        });

        const tenthItem = Array.from(resultsList.children)[9] as HTMLElement;
        if (tenthItem) {
            tenthItem.click();
        } else if (resultsList.children.length > 0) {
            const lastItem = resultsList.children[resultsList.children.length - 1] as HTMLElement;
            lastItem.click();
        }
    } catch (error) {
        console.error(error);
    }
}

filterInput.addEventListener('input', () => {
    const filterValue = filterInput.value;

    queryCountries(filterValue);
});

queryCountries('');
