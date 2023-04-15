# Tipos de autenticacao
- /direct: sem autenticacao, que deve estar desabilitada para ambientes de clientes
- /: autenticada com Bearer token do serviço xsuaa do BTP
# run localhost
- npm install
- gere um default-env com os serviços: connectivity, destination e xsuaa
- adicione a url do serviço gateway do ECC. Ex: sap/opu/odata/sap/{servico}/{endpoint}?sap-language=PT
- adicione username and password do BTP no arquivo .env
- gere o token no endpoint /token, veja exemplo no arquivo de testes
- adicione o token ao arquivo .env

# Exemplos 
 verifique o arquivo server-teste.http
 
# Deploy CF
- cf login
- criar serviços no ambiente alvo: 
      - connectivity
      - destination-service
      - xsuaa-service

- cf push