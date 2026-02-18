export function initialUiState() {
  return {
    users: [],
    loading: false,
    error: "",
    message: "Pronto para executar o fluxo."
  };
}

export function startLoading(state) {
  return {
    ...state,
    loading: true,
    error: ""
  };
}

export function applyExecuteSuccess(state, users) {
  return {
    ...state,
    users,
    loading: false,
    error: "",
    message: `Tabela preenchida com ${users.length} registro(s).`
  };
}

export function applyClearSuccess(state) {
  return {
    ...state,
    users: [],
    loading: false,
    error: "",
    message: "Tabela limpa e banco resetado."
  };
}

export function applyFailure(state, message) {
  return {
    ...state,
    loading: false,
    error: message
  };
}

export function canExecute(state) {
  return !state.loading;
}

export function canClear(state) {
  return !state.loading && state.users.length > 0;
}
