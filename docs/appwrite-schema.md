Voici le contenu amélioré et traduit en français, présenté en un seul bloc :

```markdown
# Schéma de Base de Données Appwrite pour le Calendrier HECM

## Collections

### Collection Utilisateurs
```typescript
interface Utilisateur {
  $id: string;
  nom: string;
  email: string;
  role: 'directeur' | 'professeur' | 'étudiant';
  departmentId?: string;
  niveau?: string;
  createdAt: Date;
}
```

### Collection Départements
```typescript
interface Département {
  $id: string;
  nom: string;
  coordinateurId: string; // Référence à Utilisateurs
  niveaux: string[]; // Exemple : ['L1', 'L2', 'L3', 'M1', 'M2']
  createdAt: Date;
}
```

### Collection Cours
```typescript
interface Cours {
  $id: string;
  nom: string;
  departmentId: string; // Référence à Départements
  niveau: string;
  professeurId: string; // Référence à Utilisateurs
  description?: string;
  durée: number; // en heures
  createdAt: Date;
}
```

### Collection Événements
```typescript
interface Événement {
  $id: string;
  coursId: string; // Référence à Cours
  professeurId: string; // Référence à Utilisateurs
  salle: string;
  début: Date;
  fin: Date;
  couleur: string;
  departmentId: string; // Référence à Départements
  niveau: string;
  statut: 'planifié' | 'en cours' | 'terminé' | 'annulé';
  crééPar: string; // Référence à Utilisateurs (Directeur)
  createdAt: Date;
  updatedAt: Date;
}
```

### Collection Archives
```typescript
interface Archive {
  $id: string;
  semaine: string;
  departmentId: string;
  niveau: string;
  imageFileId: string; // Référence à Stockage
  crééPar: string; // Référence à Utilisateurs
  createdAt: Date;
}
```

## Index

### Collection Événements
```typescript
// Index composites
{
  nom: "événements_département_niveau",
  attributs: ["departmentId", "niveau"],
  type: "hash"
},
{
  nom: "événements_plage_date",
  attributs: ["début", "fin"],
  type: "range"
},
{
  nom: "événements_professeur",
  attributs: ["professeurId"],
  type: "hash"
}
```

### Collection Cours
```typescript
// Index
{
  nom: "cours_département",
  attributs: ["departmentId"],
  type: "hash"
},
{
  nom: "cours_professeur",
  attributs: ["professeurId"],
  type: "hash"
}
```

### Collection Archives
```typescript
// Index composite
{
  nom: "archives_filtre",
  attributs: ["departmentId", "niveau", "semaine"],
  type: "hash"
}
```

## Règles de Sécurité

### Collection Événements
```javascript
{
  "lecture": [
    "role:professeur && document.professeurId === user.$id",
    "role:étudiant && document.departmentId === user.departmentId && document.niveau === user.niveau",
    "role:directeur"
  ],
  "écriture": ["role:directeur"],
  "création": ["role:directeur"],
  "mise_à_jour": ["role:directeur"],
  "suppression": ["role:directeur"]
}
```

### Collection Archives
```javascript
{
  "lecture": ["role:professeur", "role:directeur"],
  "écriture": ["role:directeur"],
  "création": ["role:directeur"],
  "suppression": ["role:directeur"]
}
```

## Configuration du Stockage

### Bucket Images de Planning
```typescript
{
  "$id": "images_planning",
  "nom": "Images de Planning",
  "permissions": {
    "lecture": ["role:professeur", "role:directeur"],
    "écriture": ["role:directeur"]
  },
  "tailleLimiteFichier": 10485760, // 10MB
  "extensionsFichiersAutorisées": ["png", "jpg", "jpeg"],
  "compression": "gzip",
  "chiffrement": true
}
```

## Exemples d'Intégration API

### Création d'un Nouvel Événement
```typescript
import { Databases, ID, Query } from 'appwrite';

const databases = new Databases(client);

async function créerÉvénement(donnéesÉvénement: Partial<Événement>) {
  try {
    return await databases.createDocument(
      'main',
      'événements',
      ID.unique(),
      {
        ...donnéesÉvénement,
        createdAt: new Date(),
        updatedAt: new Date(),
        statut: 'planifié'
      }
    );
  } catch (error) {
    console.error('Erreur lors de la création de l\'événement:', error);
    throw error;
  }
}
```

### Récupération du Planning Hebdomadaire
```typescript
async function obtenirPlanningHebdomadaire(departmentId: string, niveau: string, débutSemaine: Date) {
  const finSemaine = new Date(débutSemaine);
  finSemaine.setDate(finSemaine.getDate() + 7);

  try {
    return await databases.listDocuments(
      'main',
      'événements',
      [
        Query.equal('departmentId', departmentId),
        Query.equal('niveau', niveau),
        Query.greaterThanEqual('début', débutSemaine),
        Query.lessThan('début', finSemaine),
        Query.orderAsc('début')
      ]
    );
  } catch (error) {
    console.error('Erreur lors de la récupération du planning:', error);
    throw error;
  }
}
```

### Archivage du Planning
```typescript
async function archiverPlanning(imageFile: File, departmentId: string, niveau: string, semaine: string) {
  try {
    // 1. Télécharger l'image vers le stockage
    const storage = new Storage(client);
    const fileUpload = await storage.createFile(
      'images_planning',
      ID.unique(),
      imageFile
    );

    // 2. Créer un enregistrement d'archive
    return await databases.createDocument(
      'main',
      'archives',
      ID.unique(),
      {
        semaine,
        departmentId,
        niveau,
        imageFileId: fileUpload.$id,
        crééPar: user.$id,
        createdAt: new Date()
      }
    );
  } catch (error) {
    console.error('Erreur lors de l\'archivage du planning:', error);
    throw error;
  }
}
```
```
