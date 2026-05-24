import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.vote.deleteMany({})
  await prisma.commentaire.deleteMany({})
  await prisma.signalement.deleteMany({})
  await prisma.user.deleteMany({})

  // Create users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@dakar.sn',
      name: 'Admin Mairie',
      password: 'admin123',
      role: 'ADMIN',
    },
  })

  const agent = await prisma.user.create({
    data: {
      email: 'agent@dakar.sn',
      name: 'Agent Technique',
      password: 'agent123',
      role: 'AGENT',
    },
  })

  const citoyen1 = await prisma.user.create({
    data: {
      email: 'citoyen@test.sn',
      name: 'Moussa Diallo',
      password: 'test123',
      role: 'CITOYEN',
    },
  })

  const citoyen2 = await prisma.user.create({
    data: {
      email: 'alice@test.sn',
      name: 'Alice Ba',
      password: 'test123',
      role: 'CITOYEN',
    },
  })

  // Create signalements
  const signalements = [
    {
      titre: 'Nid de poule Avenue Cheikh Anta Diop',
      description: 'Grand trou dangereux pour les motos et voitures. La route est devenue impraticable depuis 2 mois. Les automobilistes sont obligés de faire des détours.',
      categorie: 'VOIRIE',
      quartier: 'Plateau',
      statut: 'EN_COURS',
      latitude: 14.6928,
      longitude: -17.0407,
    },
    {
      titre: 'Lampadaires éteints depuis 3 semaines',
      description: 'Obscurité totale la nuit au carrefour, situation dangereuse pour les habitants et insécurité généralisée.',
      categorie: 'ECLAIRAGE',
      quartier: 'Médina',
      statut: 'EN_ATTENTE',
      latitude: 14.7167,
      longitude: -17.0667,
    },
    {
      titre: 'Dépôt sauvage de déchets',
      description: 'Accumulation de déchets au carrefour, situation sanitaire mauvaise, odeurs nauséabondes.',
      categorie: 'DECHETS',
      quartier: 'Parcelles Assainies',
      statut: 'RESOLU',
      latitude: 14.7667,
      longitude: -17.0833,
    },
    {
      titre: 'Fuite eau conduite principale',
      description: 'Fuite importante, gaspillage d\'eau depuis 1 semaine. Le tuyau principal est endommagé.',
      categorie: 'EAU',
      quartier: 'Guédiawaye',
      statut: 'EN_ATTENTE',
      latitude: 14.75,
      longitude: -17.25,
    },
    {
      titre: 'Jardin public abandonné',
      description: 'Parc en mauvais état, herbes hautes, jeux endommagés, absence d\'entretien.',
      categorie: 'ESPACES_VERTS',
      quartier: 'Almadies',
      statut: 'EN_ATTENTE',
      latitude: 14.74,
      longitude: -17.17,
    },
    {
      titre: 'Route inondée saison des pluies',
      description: 'Axe impraticable chaque hivernage. L\'eau s\'accumule et bloque la circulation pendant plusieurs jours.',
      categorie: 'VOIRIE',
      quartier: 'Pikine',
      statut: 'EN_COURS',
      latitude: 14.78,
      longitude: -17.15,
    },
    {
      titre: 'Manque d\'éclairage Zone de nuit',
      description: 'La zone est mal éclairée la nuit, générant des problèmes de sécurité pour les piétons.',
      categorie: 'SECURITE',
      quartier: 'Ngor',
      statut: 'EN_ATTENTE',
      latitude: 14.76,
      longitude: -17.10,
    },
    {
      titre: 'Canalisations bouchées',
      description: 'Les canalisations d\'eau usées sont bouchées, créant des débordements sur la route.',
      categorie: 'EAU',
      quartier: 'Mermoz',
      statut: 'RESOLU',
      latitude: 14.71,
      longitude: -17.08,
    },
  ]

  for (const s of signalements) {
    await prisma.signalement.create({
      data: {
        ...s,
        auteurId: citoyen1.id,
      },
    })
  }

  // Create some votes and comments
  const allSignalements = await prisma.signalement.findMany()

  for (let i = 0; i < allSignalements.length; i++) {
    // Add random votes
    if (i % 2 === 0) {
      await prisma.vote.create({
        data: {
          userId: citoyen2.id,
          signalementId: allSignalements[i].id,
        },
      })
    }

    // Add comments
    if (i % 3 === 0) {
      await prisma.commentaire.create({
        data: {
          contenu: 'Merci d\'avoir signalé ce problème. On demande depuis longtemps que cela soit résolu!',
          auteurId: citoyen2.id,
          signalementId: allSignalements[i].id,
        },
      })
    }
  }

  console.log('✅ Base de données initialisée avec succès!')
  console.log('📊 Données de test créées:')
  console.log(`- ${signalements.length} signalements`)
  console.log('- 2 citoyens + 1 agent + 1 admin')
}

main()
  .catch((e) => {
    console.error('Erreur:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
