const form = document.querySelector("#product-form");
const nameInput = document.querySelector("#name");
const priceInput = document.querySelector("#price");
const idInput = document.querySelector("#product-id");
const rows = document.querySelector("#product-rows");
const feedback = document.querySelector("#feedback");
const search = document.querySelector("#search");
const cancelEdit = document.querySelector("#cancel-edit");
const submitLabel = document.querySelector("#submit-label");
let products = [];

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

document.querySelector("#today").textContent = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
}).format(new Date());

function report(message = "") {
    feedback.textContent = message;
}

async function api(url, options) {
    const response = await fetch(url, options);
    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.mensagem || "Não foi possível concluir a operação.");
    }
    return response.status === 204 ? null : response.json();
}

function createCell(className, content) {
    const cell = document.createElement("td");
    if (className) cell.className = className;
    if (content instanceof Node) cell.append(content);
    else cell.textContent = content;
    return cell;
}

function render() {
    const query = search.value.trim().toLocaleLowerCase("pt-BR");
    const visibleProducts = products.filter((product) => product.nome.toLocaleLowerCase("pt-BR").includes(query));
    rows.replaceChildren();

    if (visibleProducts.length === 0) {
        const emptyRow = document.createElement("tr");
        const emptyCell = createCell("empty-row", products.length ? "Nenhum produto corresponde à busca." : "Seu catálogo ainda está vazio.");
        emptyCell.colSpan = 4;
        emptyRow.append(emptyCell);
        rows.append(emptyRow);
    }

    visibleProducts.forEach((product) => {
        const row = document.createElement("tr");
        const identity = document.createElement("div");
        identity.className = "product-cell";
        const glyph = document.createElement("span");
        glyph.className = "product-glyph";
        glyph.setAttribute("aria-hidden", "true");
        glyph.textContent = product.nome.trim().charAt(0).toLocaleUpperCase("pt-BR");
        const name = document.createElement("span");
        name.className = "product-name";
        name.textContent = product.nome;
        name.title = product.nome;
        const identifier = document.createElement("span");
        identifier.className = "product-id";
        identifier.textContent = `SKU-${String(product.id).padStart(4, "0")}`;
        name.append(identifier);
        identity.append(glyph, name);
        row.append(createCell("", identity));
        row.append(createCell("price-cell", currency.format(product.preco)));

        const tier = document.createElement("span");
        const affordable = product.preco <= 100;
        tier.className = affordable ? "tier" : "tier tier-standard";
        tier.textContent = affordable ? "Acessível" : "Padrão";
        row.append(createCell("", tier));

        const actions = document.createElement("div");
        actions.className = "row-actions";
        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "icon-button";
        editButton.title = `Editar ${product.nome}`;
        editButton.setAttribute("aria-label", `Editar ${product.nome}`);
        editButton.textContent = "✎";
        editButton.addEventListener("click", () => beginEdit(product));
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "icon-button delete";
        deleteButton.title = `Excluir ${product.nome}`;
        deleteButton.setAttribute("aria-label", `Excluir ${product.nome}`);
        deleteButton.textContent = "×";
        deleteButton.addEventListener("click", () => removeProduct(product));
        actions.append(editButton, deleteButton);
        row.append(createCell("", actions));
        rows.append(row);
    });

    document.querySelector("#metric-count").textContent = String(products.length).padStart(2, "0");
    document.querySelector("#metric-value").textContent = currency.format(products.reduce((sum, product) => sum + product.preco, 0));
    document.querySelector("#metric-affordable").textContent = String(products.filter((product) => product.preco <= 100).length).padStart(2, "0");
    document.querySelector("#result-count").textContent = `${visibleProducts.length} ${visibleProducts.length === 1 ? "produto" : "produtos"}`;
}

function beginEdit(product) {
    idInput.value = product.id;
    nameInput.value = product.nome;
    priceInput.value = product.preco;
    document.querySelector("#form-title").textContent = "Editar produto";
    submitLabel.textContent = "Salvar alterações";
    cancelEdit.hidden = false;
    report();
    nameInput.focus();
    document.querySelector(".editor").scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetForm() {
    form.reset();
    idInput.value = "";
    document.querySelector("#form-title").textContent = "Novo produto";
    submitLabel.textContent = "Adicionar produto";
    cancelEdit.hidden = true;
}

async function loadProducts() {
    try {
        products = await api("/produtos");
        report();
        render();
    } catch (error) {
        report(error.message);
        document.querySelector("#result-count").textContent = "Falha ao carregar catálogo";
    }
}

async function removeProduct(product) {
    if (!window.confirm(`Excluir “${product.nome}” do catálogo?`)) return;
    try {
        await api(`/produtos/${product.id}`, { method: "DELETE" });
        if (String(idInput.value) === String(product.id)) resetForm();
        await loadProducts();
    } catch (error) {
        report(error.message);
    }
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const id = idInput.value;
    const payload = { nome: nameInput.value.trim(), preco: Number(priceInput.value) };
    try {
        await api(id ? `/produtos/${id}` : "/produtos", {
            method: id ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        resetForm();
        report(id ? "Produto atualizado." : "Produto adicionado.");
        await loadProducts();
    } catch (error) {
        report(error.message);
    }
});

cancelEdit.addEventListener("click", resetForm);
search.addEventListener("input", render);
loadProducts();