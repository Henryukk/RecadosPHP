// util
function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>\"']/g, tag => (
    {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[tag]
  ));
}

function qs(sel) { return document.querySelector(sel); }

// listagem
async function carregarRecados() {
  const lista = document.getElementById("listaRecados");
  if (!lista) {
    console.warn('Container #listaRecados não encontrado no DOM.');
    return;
  }

  lista.innerHTML = `<div class="text-muted">Carregando...</div>`;

  try {
    const resp = await fetch("api.php?action=listar");
    const dados = await resp.json();

    if (dados?.erro) {
      lista.innerHTML = `<div class="text-danger">${escapeHtml(dados.erro)}</div>`;
      return;
    }

    const recados = dados.recados || [];
    lista.innerHTML = "";

    if (!recados.length) {
      lista.innerHTML = `<div class="text-muted">Nenhum recado ainda.</div>`;
      return;
    }

    recados.forEach(r => {
      const isFav = String(r.status) === "1" || String(r.status).toLowerCase?.() === "true";

      // coluna do grid
      const col = document.createElement("div");
      col.className = "col-12";

      // card do recado
      const card = document.createElement("div");
      card.className = "card card-recado" + (isFav ? " favorito" : "");
      card.innerHTML = `
        <div class="card-body d-flex flex-column gap-2">
          <div class="d-flex justify-content-between align-items-start">
            <div class="me-3" style="white-space:pre-wrap;">${escapeHtml(r.mensagem)}</div>
            <div class="d-flex align-items-center gap-2">
              <button class="btn btn-sm btn-outline-primary" title="Editar" onclick="editar(${r.id})">Editar</button>
              <button class="btn btn-sm btn-outline-danger" title="Excluir" onclick="excluir(${r.id})">Excluir</button>
              <button class="btn btn-sm ${isFav ? 'btn-warning' : 'btn-outline-warning'}" title="Favoritar" onclick="favoritar(${r.id})">★</button>
            </div>
          </div>
          <div class="recado-data">Criado em: ${escapeHtml(r.data_criacao ?? '')}</div>
        </div>
      `;

      col.appendChild(card);
      lista.appendChild(col);
    });
  } catch (e) {
    console.error(e);
    lista.innerHTML = `<div class="text-danger">Falha ao carregar recados.</div>`;
  }
}

// crud
const form = document.getElementById("formRecado");
form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const idInput = document.getElementById("id");
  const msgInput = document.getElementById("mensagem");
  const id = idInput?.value;
  const mensagem = msgInput?.value.trim();

  if (!mensagem) {
    alert("Digite uma mensagem válida.");
    msgInput?.focus();
    return;
  }

  const formData = new FormData();
  formData.append("mensagem", mensagem);
  if (id) formData.append("id", id);

  try {
    const resp = await fetch("api.php?action=" + (id ? "editar" : "criar"), {
      method: "POST",
      body: formData
    });
    const out = await resp.json();
    if (out?.erro) return alert(out.erro);

    limparForm();
    carregarRecados();
  } catch (e2) {
    console.error(e2);
    alert("Falha ao salvar. Tente novamente.");
  }
});

qs("#btnCancelar")?.addEventListener("click", () => limparForm());

function editar(id) {
  fetch("api.php?action=detalhe&id=" + id)
    .then(r => r.json())
    .then(d => {
      if (d?.erro) return alert(d.erro);
      document.getElementById("id").value = d.recado.id;
      document.getElementById("mensagem").value = d.recado.mensagem;
      document.getElementById("mensagem").focus();
    })
    .catch(() => alert("Falha ao carregar o recado."));
}

function excluir(id) {
  if (!confirm("Tem certeza que deseja excluir?")) return;
  fetch("api.php?action=excluir&id=" + id)
    .then(r => r.json())
    .then(d => {
      if (d?.erro) return alert(d.erro);
      carregarRecados();
    })
    .catch(() => alert("Falha ao excluir."));
}

function favoritar(id) {
  fetch("api.php?action=favoritar&id=" + id)
    .then(r => r.json())
    .then(d => {
      if (d?.erro) return alert(d.erro);
      carregarRecados();
    })
    .catch(() => alert("Falha ao favoritar."));
}

function limparForm() {
  const fid = document.getElementById("id");
  const fmsg = document.getElementById("mensagem");
  if (fid) fid.value = "";
  if (fmsg) fmsg.value = "";
}

carregarRecados();