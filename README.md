# Arena BRB API - Documentação para Frontends

Esta API serve como backend único para três frontends diferentes. Este documento explica como cada frontend deve integrar com a API.

---

## 📋 Índice

- [Configuração Inicial](#configuração-inicial)
- [Site 1: Formulário de Preferências](#site-1-formulário-de-preferências)
- [Site 2: Pesquisa de Satisfação](#site-2-pesquisa-de-satisfação)
- [Site 3: Dashboard Administrativo](#site-3-dashboard-administrativo)
- [Tratamento de Erros](#tratamento-de-erros)
- [Códigos de Status HTTP](#códigos-de-status-http)
- [Regras Gerais para Envio de Dados](#️-regras-gerais-para-envio-de-dados)
- [Dicas de Implementação](#-dicas-de-implementação)
- [Resumo Rápido](#-resumo-rápido)

---

## ⚙️ Configuração Inicial

### URL Base da API

```
Desenvolvimento: http://localhost:3000
Produção: https://sua-api.com
```

### CORS

A API está configurada para aceitar requisições de qualquer origem (em desenvolvimento). Em produção, será restrito aos domínios específicos dos 3 sites.

---

## 🎯 Site 1: Formulário de Preferências

### Objetivo

Coletar as preferências de eventos dos usuários.

### Rota Disponível

#### `POST /preferences`

Envia uma lista de preferências do usuário.

**🔓 Rota Pública** - Não requer autenticação

**Body (JSON):**

```json
{
  "preferences": ["shows", "football", "cultural", "festivals"]
}
```

**Validações:**

- `preferences` é obrigatório
- `preferences` deve ser um array de strings
- O array não pode estar vazio
- Cada item do array deve ser uma string

### ✅ Como Enviar Dados Corretamente

#### ✔️ Payload CORRETO:

```json
{
  "preferences": ["shows", "football", "cultural", "festivals"]
}
```

```json
{
  "preferences": ["concerts"]
}
```

#### ❌ Payloads INCORRETOS:

```json
// ERRO: Campo preferences faltando
{}

// ERRO: Array vazio
{
  "preferences": []
}

// ERRO: Não é um array
{
  "preferences": "shows"
}

// ERRO: Itens não são strings
{
  "preferences": [1, 2, 3]
}

// ERRO: Mistura de tipos
{
  "preferences": ["shows", 123, true]
}

// ERRO: Campo com nome errado
{
  "preference": ["shows"]
}
```

#### 📋 Checklist Antes de Enviar:

- [ ] O campo se chama `preferences` (no plural)
- [ ] O valor é um **array** `[]`
- [ ] O array tem **pelo menos 1 item**
- [ ] Todos os itens são **strings** (texto entre aspas)
- [ ] O header `Content-Type: application/json` está presente

**Resposta de Sucesso (201):**

```json
{
  "id": "clx1a2b3c4d5e6f7g8h9i0j1k",
  "preferences": ["shows", "football", "cultural", "festivals"],
  "createdAt": "2025-10-29T12:34:56.789Z"
}
```

**Exemplo de Erro (400):**

```json
{
  "statusCode": 400,
  "message": [
    "Preferences array cannot be empty",
    "Each preference must be a string"
  ],
  "error": "Bad Request"
}
```

### Exemplo de Código para Site 1

#### JavaScript/React

```javascript
// Função para enviar preferências
async function submitPreferences(preferences) {
  try {
    const response = await fetch('http://localhost:3000/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        preferences: preferences,
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao enviar preferências');
    }

    const data = await response.json();
    console.log('Preferências enviadas com sucesso:', data);
    return data;
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}

// Uso
const userPreferences = ['shows', 'football', 'cultural'];
submitPreferences(userPreferences);
```

#### Axios

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:3000';

async function submitPreferences(preferences) {
  try {
    const response = await axios.post(`${API_URL}/preferences`, {
      preferences: preferences,
    });
    console.log('Sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro:', error.response?.data || error.message);
    throw error;
  }
}
```

---

## 📝 Site 2: Pesquisa de Satisfação

### Objetivo

Coletar respostas de uma pesquisa detalhada de 10 perguntas sobre a experiência do usuário em eventos.

### Rota Disponível

#### `POST /survey`

Envia as respostas da pesquisa de satisfação.

**🔓 Rota Pública** - Não requer autenticação

**Body (JSON):**

```json
{
  "userId": 1,
  "genderIdentity": "CISGENDER_WOMAN",
  "ageRange": "AGE_18_25",
  "eventType": "SHOWS_FESTIVALS",
  "transportType": "APP_UBER_99",
  "recommendationScore": 9,
  "gateFindability": "EASY",
  "highlight": "EVENT_QUALITY",
  "frustration": "NOTHING_FRUSTRATED",
  "nextVibeScore": 10,
  "artistWish": "Taylor Swift"
}
```

**Campos:**

| Campo                 | Obrigatório | Tipo   | Validação          | Descrição                             |
| --------------------- | ----------- | ------ | ------------------ | ------------------------------------- |
| `userId`              | ✅ Sim      | number | Inteiro positivo   | ID do usuário                         |
| `genderIdentity`      | ❌ Não      | enum   | Ver valores abaixo | Q1: Como você se declara?             |
| `ageRange`            | ❌ Não      | enum   | Ver valores abaixo | Q2: Qual é a sua faixa etária?        |
| `eventType`           | ❌ Não      | enum   | Ver valores abaixo | Q3: Qual tipo de evento participou?   |
| `transportType`       | ❌ Não      | enum   | Ver valores abaixo | Q4: Principal meio de transporte?     |
| `recommendationScore` | ❌ Não      | number | 0-10               | Q5: NPS - Você recomendaria?          |
| `gateFindability`     | ❌ Não      | enum   | Ver valores abaixo | Q6: Facilidade para encontrar portão? |
| `highlight`           | ❌ Não      | enum   | Ver valores abaixo | Q7: Área de destaque?                 |
| `frustration`         | ❌ Não      | enum   | Ver valores abaixo | Q8: Ponto de frustração?              |
| `nextVibeScore`       | ❌ Não      | number | 0-10               | Q9: Vibe para próximo evento?         |
| `artistWish`          | ❌ Não      | string | Qualquer texto     | Q10: Qual próximo artista deseja?     |

### ✅ Como Enviar Dados Corretamente

#### ✔️ Payload CORRETO (com todos os campos):

```json
{
  "userId": 1,
  "genderIdentity": "CISGENDER_WOMAN",
  "ageRange": "AGE_18_25",
  "eventType": "SHOWS_FESTIVALS",
  "transportType": "APP_UBER_99",
  "recommendationScore": 9,
  "gateFindability": "EASY",
  "highlight": "EVENT_QUALITY",
  "frustration": "NOTHING_FRUSTRATED",
  "nextVibeScore": 10,
  "artistWish": "Taylor Swift"
}
```

#### ✔️ Payload CORRETO (apenas campos obrigatórios):

```json
{
  "userId": 1
}
```

#### ✔️ Payload CORRETO (parcial - alguns campos opcionais):

```json
{
  "userId": 1,
  "genderIdentity": "CISGENDER_MAN",
  "ageRange": "AGE_26_35",
  "recommendationScore": 8
}
```

#### ❌ Payloads INCORRETOS:

```json
// ERRO: userId faltando (obrigatório)
{
  "genderIdentity": "CISGENDER_WOMAN"
}

// ERRO: userId não é número
{
  "userId": "1"
}

// ERRO: recommendationScore fora do intervalo (0-10)
{
  "userId": 1,
  "recommendationScore": 15
}

// ERRO: nextVibeScore não é inteiro
{
  "userId": 1,
  "nextVibeScore": 8.5
}

// ERRO: Valor do enum inválido
{
  "userId": 1,
  "genderIdentity": "MULHER"
}

// ERRO: Valor do enum em minúsculas (deve ser MAIÚSCULAS)
{
  "userId": 1,
  "ageRange": "age_18_25"
}

// ERRO: Campo com nome errado
{
  "user_id": 1
}
```

#### 📋 Checklist Antes de Enviar:

- [ ] `userId` está presente e é um **número inteiro**
- [ ] Se enviar `recommendationScore`, o valor está entre **0 e 10**
- [ ] Se enviar `nextVibeScore`, o valor está entre **0 e 10**
- [ ] Todos os enums estão em **MAIÚSCULAS** e com **underscore** (ex: `CISGENDER_WOMAN`)
- [ ] Valores dos enums são **exatamente** como na lista abaixo (não invente valores)
- [ ] Campos opcionais podem ser **omitidos** (não precisa enviar como `null`)
- [ ] O header `Content-Type: application/json` está presente

### Valores Permitidos para Enums

#### `genderIdentity` (Q1)

```javascript
'CISGENDER_WOMAN'; // Mulher Cisgênero
'TRANSGENDER_WOMAN'; // Mulher Transgênero
'CISGENDER_MAN'; // Homem Cisgênero
'TRANSGENDER_MAN'; // Homem Transgênero
'PREFER_NOT_TO_INFORM'; // Prefiro não informar
```

#### `ageRange` (Q2)

```javascript
'UNDER_18'; // Abaixo de 18
'AGE_18_25'; // 18 a 25 anos
'AGE_26_35'; // 26 a 35 anos
'AGE_36_45'; // 36 a 45 anos
'OVER_45'; // Acima de 45 anos
```

#### `eventType` (Q3)

```javascript
'SHOWS_FESTIVALS'; // Shows e Festivais
'EXECUTIVE_EVENT'; // Evento Executivo
'SOCCER_GAME'; // Jogo de Futebol
'CHILDREN_EVENT'; // Evento Infantil
'GUIDED_TOUR'; // Tour Guiado
```

#### `transportType` (Q4)

```javascript
'PRIVATE_CAR'; // Carro Particular
'APP_UBER_99'; // Aplicativo (Uber/99)
'PUBLIC_TRANSPORT'; // Transporte Público
'RIDE_TAXI'; // Carona/Táxi
'OTHER'; // Outro
```

#### `gateFindability` (Q6)

```javascript
'EXTREMELY_EASY'; // Extremamente Fácil
'EASY'; // Fácil
'REASONABLE'; // Razoável
'DIFFICULT'; // Difícil
'VERY_DIFFICULT'; // Muito Difícil
```

#### `highlight` (Q7)

```javascript
'EVENT_QUALITY'; // Qualidade do Evento
'STAFF_SERVICE'; // Atendimento do Staff
'BATHROOM_CLEANLINESS'; // Limpeza dos Banheiros
'FOOD_AREAS'; // Áreas de Alimentação
'OVERALL_STRUCTURE'; // Estrutura Geral
'ACCESSIBILITY'; // Acessibilidade
```

#### `frustration` (Q8)

```javascript
'PARKING_ARRIVAL'; // Estacionamento/Chegada
'ENTRY_QUEUES'; // Filas na Entrada
'FOOD_PRICES'; // Preços de Alimentação
'BATHROOM_WAIT'; // Espera nos Banheiros
'NOTHING_FRUSTRATED'; // Nada me Frustrou
```

**Resposta de Sucesso (201):**

```json
{
  "id": 1,
  "userId": 1,
  "genderIdentity": "CISGENDER_WOMAN",
  "ageRange": "AGE_18_25",
  "eventType": "SHOWS_FESTIVALS",
  "transportType": "APP_UBER_99",
  "recommendationScore": 9,
  "gateFindability": "EASY",
  "highlight": "EVENT_QUALITY",
  "frustration": "NOTHING_FRUSTRATED",
  "nextVibeScore": 10,
  "artistWish": "Taylor Swift",
  "createdAt": "2025-10-29T12:34:56.789Z",
  "updatedAt": "2025-10-29T12:34:56.789Z",
  "deletedAt": null
}
```

### Exemplo de Código para Site 2

#### JavaScript/React

```javascript
// Função para enviar pesquisa de satisfação
async function submitSurvey(surveyData) {
  try {
    const response = await fetch('http://localhost:3000/survey', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(surveyData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao enviar pesquisa');
    }

    const data = await response.json();
    console.log('Pesquisa enviada com sucesso:', data);
    return data;
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
}

// Exemplo de uso com dados completos
const surveyData = {
  userId: 1,
  genderIdentity: 'CISGENDER_WOMAN',
  ageRange: 'AGE_18_25',
  eventType: 'SHOWS_FESTIVALS',
  transportType: 'APP_UBER_99',
  recommendationScore: 9,
  gateFindability: 'EASY',
  highlight: 'EVENT_QUALITY',
  frustration: 'NOTHING_FRUSTRATED',
  nextVibeScore: 10,
  artistWish: 'Taylor Swift',
};

submitSurvey(surveyData);
```

#### Exemplo com Formulário React

```jsx
import { useState } from 'react';

function SurveyForm() {
  const [formData, setFormData] = useState({
    userId: 1, // Pegar do contexto de autenticação
    genderIdentity: '',
    ageRange: '',
    eventType: '',
    transportType: '',
    recommendationScore: 5,
    gateFindability: '',
    highlight: '',
    frustration: '',
    nextVibeScore: 5,
    artistWish: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Remover campos vazios (opcionais)
    const cleanData = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => v !== ''),
    );

    try {
      const response = await fetch('http://localhost:3000/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanData),
      });

      if (response.ok) {
        alert('Pesquisa enviada com sucesso!');
      }
    } catch (error) {
      alert('Erro ao enviar pesquisa');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Seus campos de formulário aqui */}
      <button type="submit">Enviar Pesquisa</button>
    </form>
  );
}
```

---

## 🔐 Site 3: Dashboard Administrativo

### Objetivo

Visualizar e analisar os dados coletados dos Sites 1 e 2. **Todas as rotas são protegidas e requerem autenticação JWT.**

### Fluxo de Autenticação

```
1. Admin faz login → Recebe token JWT
2. Inclui token em todas as requisições seguintes
3. Token válido por 24 horas
```

---

### 🔑 Autenticação

#### `POST /auth/login`

Faz login e retorna um token JWT.

**🔓 Rota Pública** - Não requer autenticação

**Body (JSON):**

```json
{
  "email": "admin@example.com",
  "passwordHash": "senha123"
}
```

### ✅ Como Enviar Dados Corretamente

#### ✔️ Payload CORRETO:

```json
{
  "email": "admin@example.com",
  "passwordHash": "senha123"
}
```

#### ❌ Payloads INCORRETOS:

```json
// ERRO: Campo email faltando
{
  "passwordHash": "senha123"
}

// ERRO: Campo passwordHash faltando
{
  "email": "admin@example.com"
}

// ERRO: Email inválido (sem @)
{
  "email": "adminexample.com",
  "passwordHash": "senha123"
}

// ERRO: Campos vazios
{
  "email": "",
  "passwordHash": ""
}

// ERRO: Campo com nome errado
{
  "email": "admin@example.com",
  "password": "senha123"
}
```

#### 📋 Checklist Antes de Enviar:

- [ ] Campo `email` está presente
- [ ] Email é válido (contém `@`)
- [ ] Campo `passwordHash` está presente (não `password`)
- [ ] Senha não está vazia
- [ ] O header `Content-Type: application/json` está presente

**Resposta de Sucesso (200 ou 201):**

```json
{
  "message": "Usuario logado com sucesso!",
  "user": {
    "id": 1,
    "fullName": "Admin User",
    "email": "admin@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**⚠️ IMPORTANTE:** Salve o `token` para usar nas próximas requisições!

#### `POST /auth/register`

Cria um novo usuário admin (se necessário).

**🔓 Rota Pública** - Não requer autenticação

**Body (JSON):**

```json
{
  "fullName": "Admin User",
  "email": "admin@example.com",
  "passwordHash": "senha123"
}
```

---

### 📊 Rotas de Analytics (Protegidas)

Todas as rotas abaixo requerem o header de autenticação:

```
Authorization: Bearer SEU_TOKEN_JWT_AQUI
```

#### `GET /dashboard/analytics/survey`

Retorna estatísticas agregadas das pesquisas de satisfação.

**🔒 Rota Protegida** - Requer JWT + Role ADMIN

**Query Parameters (Filtros Opcionais):**

- `startDate` (string, formato ISO): Data inicial (ex: `2025-01-01`)
- `endDate` (string, formato ISO): Data final (ex: `2025-12-31`)
- `genderIdentity` (enum): Filtrar por identidade de gênero
- `ageRange` (enum): Filtrar por faixa etária
- `eventType` (enum): Filtrar por tipo de evento

**Exemplos de Requisição:**

```
GET /dashboard/analytics/survey
GET /dashboard/analytics/survey?startDate=2025-01-01&endDate=2025-12-31
GET /dashboard/analytics/survey?eventType=SHOWS_FESTIVALS
GET /dashboard/analytics/survey?ageRange=AGE_18_25&genderIdentity=CISGENDER_WOMAN
```

**Resposta de Sucesso (200):**

```json
{
  "totalResponses": 1250,
  "npsAverage": 8.2,
  "nextVibeAverage": 7.8,
  "genderBreakdown": {
    "CISGENDER_WOMAN": 500,
    "CISGENDER_MAN": 450,
    "PREFER_NOT_TO_INFORM": 300
  },
  "ageRangeBreakdown": {
    "AGE_18_25": 600,
    "AGE_26_35": 400,
    "AGE_36_45": 150,
    "OVER_45": 100
  },
  "eventTypeBreakdown": {
    "SHOWS_FESTIVALS": 700,
    "SOCCER_GAME": 300,
    "EXECUTIVE_EVENT": 150,
    "CHILDREN_EVENT": 100
  },
  "transportTypeBreakdown": {
    "APP_UBER_99": 500,
    "PRIVATE_CAR": 400,
    "PUBLIC_TRANSPORT": 250,
    "RIDE_TAXI": 100
  },
  "gateFindabilityBreakdown": {
    "EASY": 600,
    "EXTREMELY_EASY": 400,
    "REASONABLE": 200,
    "DIFFICULT": 50
  },
  "highlightBreakdown": {
    "EVENT_QUALITY": 500,
    "STAFF_SERVICE": 300,
    "OVERALL_STRUCTURE": 250,
    "FOOD_AREAS": 200
  },
  "frustrationBreakdown": {
    "FOOD_PRICES": 400,
    "ENTRY_QUEUES": 300,
    "PARKING_ARRIVAL": 200,
    "NOTHING_FRUSTRATED": 350
  }
}
```

---

#### `GET /dashboard/analytics/preference`

Retorna estatísticas das preferências de eventos.

**🔒 Rota Protegida** - Requer JWT + Role ADMIN

**Query Parameters (Filtros Opcionais):**

- `startDate` (string, formato ISO): Data inicial
- `endDate` (string, formato ISO): Data final

**Exemplos de Requisição:**

```
GET /dashboard/analytics/preference
GET /dashboard/analytics/preference?startDate=2025-01-01&endDate=2025-12-31
```

**Resposta de Sucesso (200):**

```json
{
  "totalSubmissions": 800,
  "preferenceBreakdown": {
    "shows": 550,
    "football": 300,
    "cultural": 250,
    "festivals": 400,
    "sports": 150
  }
}
```

---

### Exemplo de Código para Site 3 (Dashboard)

#### JavaScript/React com Context API

```javascript
import { createContext, useContext, useState } from 'react';

// Context para autenticação
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          passwordHash: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const userToken = data.user.token;
        setToken(userToken);
        localStorage.setItem('token', userToken);
        return { success: true, data };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

#### Serviço de API com Axios

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Criar instância do axios com interceptor
const api = axios.create({
  baseURL: API_URL,
});

// Adicionar token automaticamente em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Serviço de Analytics
export const analyticsService = {
  // Buscar analytics de pesquisas
  getSurveyAnalytics: async (filters = {}) => {
    try {
      const response = await api.get('/dashboard/analytics/survey', {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar analytics de pesquisa:', error);
      throw error;
    }
  },

  // Buscar analytics de preferências
  getPreferenceAnalytics: async (startDate, endDate) => {
    try {
      const response = await api.get('/dashboard/analytics/preference', {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar analytics de preferências:', error);
      throw error;
    }
  },
};

// Exemplo de uso em um componente
export function DashboardComponent() {
  const [surveyData, setSurveyData] = useState(null);
  const [preferenceData, setPreferenceData] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      // Buscar analytics com filtros
      const survey = await analyticsService.getSurveyAnalytics({
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        eventType: 'SHOWS_FESTIVALS',
      });
      setSurveyData(survey);

      const preference = await analyticsService.getPreferenceAnalytics(
        '2025-01-01',
        '2025-12-31',
      );
      setPreferenceData(preference);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  return <div>{/* Renderizar gráficos e estatísticas */}</div>;
}
```

#### Hook Customizado para Analytics

```javascript
import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export function useAnalytics() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSurveyAnalytics = async (filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = `http://localhost:3000/dashboard/analytics/survey${queryParams ? '?' + queryParams : ''}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar dados');
      }

      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const fetchPreferenceAnalytics = async (startDate, endDate) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const url = `http://localhost:3000/dashboard/analytics/preference?${params}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar dados');
      }

      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return {
    fetchSurveyAnalytics,
    fetchPreferenceAnalytics,
    loading,
    error,
  };
}
```

---

## ⚠️ Tratamento de Erros

### Erros Comuns e Soluções

#### 400 - Bad Request

```json
{
  "statusCode": 400,
  "message": [
    "preferences must be an array",
    "Recommendation score must be at least 0"
  ],
  "error": "Bad Request"
}
```

**Causa:** Dados inválidos no body da requisição.
**Solução:** Verifique se os dados estão no formato correto e atendem às validações.

#### 401 - Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**Causa:** Token JWT inválido, expirado ou ausente.
**Solução:** Faça login novamente para obter um novo token.

#### 403 - Forbidden

```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

**Causa:** Usuário não tem permissão (não é ADMIN).
**Solução:** Certifique-se de que o usuário tem a role correta.

#### 404 - Not Found

```json
{
  "statusCode": 404,
  "message": "Email não encontrado",
  "error": "Not Found"
}
```

**Causa:** Recurso não encontrado (ex: email não existe).
**Solução:** Verifique se os dados estão corretos.

---

## 📊 Códigos de Status HTTP

| Código | Significado           | Quando Ocorre                                   |
| ------ | --------------------- | ----------------------------------------------- |
| 200    | OK                    | Requisição GET bem-sucedida                     |
| 201    | Created               | Recurso criado com sucesso (POST)               |
| 400    | Bad Request           | Dados inválidos ou faltando campos obrigatórios |
| 401    | Unauthorized          | Token ausente, inválido ou expirado             |
| 403    | Forbidden             | Usuário sem permissão (role incorreta)          |
| 404    | Not Found             | Recurso não encontrado                          |
| 409    | Conflict              | Conflito (ex: email já cadastrado)              |
| 500    | Internal Server Error | Erro no servidor                                |

---

## 🛡️ Regras Gerais para Envio de Dados

### Headers Obrigatórios

Todas as requisições devem incluir:

```javascript
headers: {
  'Content-Type': 'application/json'
}
```

Para rotas protegidas (Dashboard), também incluir:

```javascript
headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer SEU_TOKEN_AQUI'
}
```

### Formato dos Dados

#### ✅ JSON Válido

```json
{
  "campo": "valor"
}
```

#### ❌ JSON Inválido

```javascript
// ERRO: Aspas simples ao invés de duplas
{ 'campo': 'valor' }

// ERRO: Vírgula no último item
{
  "campo1": "valor1",
  "campo2": "valor2",
}

// ERRO: Sem aspas nas chaves
{
  campo: "valor"
}
```

### Tipos de Dados

| Tipo JavaScript | Como Enviar        | Exemplo              |
| --------------- | ------------------ | -------------------- |
| String          | Entre aspas duplas | `"texto"`            |
| Number          | Sem aspas          | `123` ou `9.5`       |
| Boolean         | Sem aspas          | `true` ou `false`    |
| Array           | Colchetes `[]`     | `["item1", "item2"]` |
| Null            | Palavra-chave      | `null`               |

### Validação de Enums

Todos os enums **devem ser enviados exatamente** como estão documentados:

- ✅ `CISGENDER_WOMAN` (correto)
- ❌ `cisgender_woman` (minúsculas - ERRADO)
- ❌ `Cisgender_Woman` (camelCase - ERRADO)
- ❌ `CISGENDER WOMAN` (com espaço - ERRADO)
- ❌ `WOMAN` (incompleto - ERRADO)

### Campos Opcionais vs Obrigatórios

#### Campos Obrigatórios

Se faltarem, você receberá erro **400 Bad Request**.

**Site 1:**

- `preferences` ✅ Obrigatório

**Site 2:**

- `userId` ✅ Obrigatório

**Site 3 (Login):**

- `email` ✅ Obrigatório
- `passwordHash` ✅ Obrigatório

#### Campos Opcionais

Podem ser omitidos do payload. **Não envie como `null` ou `""`**.

```javascript
// ✅ CORRETO - Omitir campos opcionais
{
  "userId": 1,
  "ageRange": "AGE_18_25"
}

// ❌ EVITE - Enviar campos opcionais como null
{
  "userId": 1,
  "ageRange": "AGE_18_25",
  "genderIdentity": null,
  "eventType": null
}

// ❌ EVITE - Enviar campos opcionais vazios
{
  "userId": 1,
  "artistWish": ""
}
```

### Números: Inteiros vs Decimais

- `userId`: **Número inteiro** (1, 2, 3...)
- `recommendationScore`: **Número inteiro** de 0 a 10 (0, 1, 2... 10)
- `nextVibeScore`: **Número inteiro** de 0 a 10 (0, 1, 2... 10)

```javascript
// ✅ CORRETO
{
  "userId": 1,
  "recommendationScore": 9
}

// ❌ INCORRETO - Números como string
{
  "userId": "1",
  "recommendationScore": "9"
}

// ❌ INCORRETO - Números decimais onde não são permitidos
{
  "recommendationScore": 8.5
}
```

### Arrays

Arrays devem conter apenas elementos do mesmo tipo:

```javascript
// ✅ CORRETO - Array de strings
{
  "preferences": ["shows", "football", "cultural"]
}

// ❌ INCORRETO - Tipos misturados
{
  "preferences": ["shows", 123, true]
}

// ❌ INCORRETO - Array vazio quando não permitido
{
  "preferences": []
}
```

---

## 🔧 Dicas de Implementação

### 1. Armazenamento do Token JWT

```javascript
// Salvar token após login
localStorage.setItem('token', token);

// Recuperar token
const token = localStorage.getItem('token');

// Remover token (logout)
localStorage.removeItem('token');
```

### 2. Interceptor Global para Autenticação (Axios)

```javascript
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor para renovar token ou redirecionar ao login
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado - redirecionar para login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
```

### 3. Validação de Formulário no Frontend

```javascript
// Exemplo de validação antes de enviar
function validateSurveyData(data) {
  const errors = [];

  if (!data.userId) {
    errors.push('User ID é obrigatório');
  }

  if (data.recommendationScore !== undefined) {
    if (data.recommendationScore < 0 || data.recommendationScore > 10) {
      errors.push('Recommendation Score deve estar entre 0 e 10');
    }
  }

  if (data.nextVibeScore !== undefined) {
    if (data.nextVibeScore < 0 || data.nextVibeScore > 10) {
      errors.push('Next Vibe Score deve estar entre 0 e 10');
    }
  }

  return errors;
}
```

---

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com a equipe de backend.

---

## 🚀 Resumo Rápido

### Tabela de Rotas

| Site       | Rota(s)                                                                                          | Autenticação | Propósito                                    |
| ---------- | ------------------------------------------------------------------------------------------------ | ------------ | -------------------------------------------- |
| **Site 1** | `POST /preferences`                                                                              | ❌ Não       | Enviar preferências de eventos               |
| **Site 2** | `POST /survey`                                                                                   | ❌ Não       | Enviar pesquisa de satisfação (10 perguntas) |
| **Site 3** | `POST /auth/login`<br>`GET /dashboard/analytics/survey`<br>`GET /dashboard/analytics/preference` | ✅ Sim (JWT) | Login e visualização de analytics            |

### Referência Rápida: Campos Obrigatórios

| Rota                                  | Campos Obrigatórios                 | Tipo de Dados                |
| ------------------------------------- | ----------------------------------- | ---------------------------- |
| `POST /preferences`                   | `preferences`                       | Array de strings (não vazio) |
| `POST /survey`                        | `userId`                            | Number (inteiro)             |
| `POST /auth/login`                    | `email`, `passwordHash`             | String, String               |
| `POST /auth/register`                 | `fullName`, `email`, `passwordHash` | String, String, String       |
| `GET /dashboard/analytics/survey`     | Nenhum (todos opcionais)            | Query params opcionais       |
| `GET /dashboard/analytics/preference` | Nenhum (todos opcionais)            | Query params opcionais       |

### Checklist Geral de Validação

Antes de enviar qualquer requisição:

- [ ] O header `Content-Type: application/json` está presente
- [ ] O JSON está **válido** (aspas duplas, sem vírgulas extras)
- [ ] Campos **obrigatórios** estão presentes
- [ ] Tipos de dados estão **corretos** (number sem aspas, strings com aspas)
- [ ] **Enums** estão em MAIÚSCULAS e com underscore
- [ ] Valores numéricos estão nos **intervalos permitidos** (0-10)
- [ ] Arrays não estão **vazios** quando obrigatórios
- [ ] Para rotas protegidas: Token JWT está no header `Authorization`

### Erros Mais Comuns

| Erro                      | Causa                                         | Solução                                   |
| ------------------------- | --------------------------------------------- | ----------------------------------------- |
| 400 Bad Request           | Dados inválidos ou campo obrigatório faltando | Verifique o formato e campos obrigatórios |
| 401 Unauthorized          | Token JWT inválido ou ausente                 | Faça login novamente                      |
| 403 Forbidden             | Usuário sem permissão (não é admin)           | Verifique a role do usuário               |
| 404 Not Found             | Email/recurso não encontrado                  | Verifique se o email está correto         |
| 500 Internal Server Error | Erro no servidor                              | Entre em contato com o suporte            |

---

**Versão:** 1.0.0  
**Última Atualização:** 29/10/2025
