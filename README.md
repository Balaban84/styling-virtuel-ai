
# Styling Virtuel AI v1.3

Une application web d'essayage virtuel moderne utilisant l'intelligence artificielle Google Gemini (modèle `gemini-2.5-flash-image`) pour visualiser des vêtements sur des modèles humains personnalisables.

## Fonctionnalités
- 👗 **Upload de vêtements** : Téléchargez n'importe quelle pièce de mode (haut, robe, etc.).
- 👤 **Personnalisation complète** : Choisissez le genre, l'âge, la morphologie, le teint et la pose du modèle.
- 🖼️ **Décors variés** : Changez l'arrière-plan pour simuler différents contextes (plage, urbain, intérieur chic).
- 🔄 **Cohérence** : Option pour garder le même modèle entre deux générations (via seed).
- ✏️ **Retouches IA** : Modifiez l'image générée avec des instructions textuelles naturelles.

## Installation Locale
1. Clonez le dépôt.
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Créez un fichier `.env` à la racine ou configurez votre environnement avec :
   ```
   API_KEY=votre_cle_gemini_ici
   ```
4. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```

## Déploiement
L'application est optimisée pour un déploiement sur **Vercel** ou **GitHub Pages**.
Assurez-vous d'ajouter la variable d'environnement `API_KEY` dans vos réglages de déploiement.

## Technologies
- React 19 / TypeScript / Vite
- Tailwind CSS (Interface épurée et moderne)
- Google Generative AI SDK
