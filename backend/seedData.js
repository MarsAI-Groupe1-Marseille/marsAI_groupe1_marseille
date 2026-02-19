const { User, JuryList, Submission, Director, JuryMember, JuryListSubmission } = require('./models');
const sequelize = require('./config/db');

async function seedData() {
  try {
    // Synchroniser la DB
    await sequelize.sync();

    // 1. Créer ou récupérer un utilisateur jury
    const [jury, juryCreated] = await User.findOrCreate({
      where: { email: 'jury@test.com' },
      defaults: {
        email: 'jury@test.com',
        full_name: 'Jury Marseille',
        role: 'jury',
        password_hash: '$2b$10$wsDcaDk5BP.qIfugqE./geLIroEJdORZ9YfzVr3RY5fMlrLRjG.pm' // password123
      }
    });
    console.log(juryCreated ? 'Jury créé' : 'Jury trouvé', jury.id);

    // 2. Créer des directors
    const [director1] = await Director.findOrCreate({
      where: { email: 'jean.dupont@email.com' },
      defaults: {
        civility: 'M',
        first_name: 'Jean',
        last_name: 'Dupont',
        birth_date: '1985-05-15',
        email: 'jean.dupont@email.com',
        mobile: '0612345678',
        job_title: 'Réalisateur'
      }
    });

    const [director2] = await Director.findOrCreate({
      where: { email: 'marie.martin@email.com' },
      defaults: {
        civility: 'Mme',
        first_name: 'Marie',
        last_name: 'Martin',
        birth_date: '1990-03-22',
        email: 'marie.martin@email.com',
        mobile: '0612345679',
        job_title: 'Cinéaste'
      }
    });

    // 3. Créer des submissions (films)
    const [sub1] = await Submission.findOrCreate({
      where: { title_original: 'L\'Algorithme Perdu' },
      defaults: {
        director_id: director1.id,
        title_original: 'L\'Algorithme Perdu',
        title_english: 'The Lost Algorithm',
        duration_seconds: 300,
        language_main: 'FR',
        synopsis_original: 'Un drame sur l\'IA',
        synopsis_english: 'A drama about AI',
        ai_classification: 'Hybrid',
        youtube_id: 'dQw4w9WgXcQ',
        poster_url: 'https://via.placeholder.com/300x200?text=Algorithm',
        approval_status: 'approved'
      }
    });

    const [sub2] = await Submission.findOrCreate({
      where: { title_original: 'Rêves Numériques' },
      defaults: {
        director_id: director2.id,
        title_original: 'Rêves Numériques',
        title_english: 'Digital Dreams',
        duration_seconds: 420,
        language_main: 'FR',
        synopsis_original: 'Une expérience visuelle surprenante',
        synopsis_english: 'A surprising visual experience',
        ai_classification: '100% IA',
        youtube_id: 'jNQXAC9IVRw',
        poster_url: 'https://via.placeholder.com/300x200?text=Dreams',
        approval_status: 'approved'
      }
    });

    const [sub3] = await Submission.findOrCreate({
      where: { title_original: 'Réflexions' },
      defaults: {
        director_id: director1.id,
        title_original: 'Réflexions',
        title_english: 'Reflections',
        duration_seconds: 180,
        language_main: 'FR',
        synopsis_original: 'Court métrage introspectif',
        synopsis_english: 'Introspective short film',
        ai_classification: 'Hybrid',
        youtube_id: '9bZkp7q19f0',
        poster_url: 'https://via.placeholder.com/300x200?text=Reflections',
        approval_status: 'approved'
      }
    });

    console.log('✅ Submissions créées');

    // 4. Créer les jury lists (playlists)
    const [playlist1] = await JuryList.findOrCreate({
      where: { name: 'Sélection 2026' },
      defaults: { name: 'Sélection 2026' }
    });

    const [playlist2] = await JuryList.findOrCreate({
      where: { name: 'Courts Métrages' },
      defaults: { name: 'Courts Métrages' }
    });

    console.log('✅ Playlists créées');

    // 5. Associer l'utilisateur aux playlists (JuryMember)
    await JuryMember.findOrCreate({
      where: {
        user_id: jury.id,
        jury_list_id: playlist1.id
      }
    });

    await JuryMember.findOrCreate({
      where: {
        user_id: jury.id,
        jury_list_id: playlist2.id
      }
    });

    console.log('✅ Jury associé aux playlists');

    // 6. Associer les films aux playlists
    await JuryListSubmission.findOrCreate({
      where: {
        jury_list_id: playlist1.id,
        submission_id: sub1.id
      }
    });

    await JuryListSubmission.findOrCreate({
      where: {
        jury_list_id: playlist1.id,
        submission_id: sub2.id
      }
    });

    await JuryListSubmission.findOrCreate({
      where: {
        jury_list_id: playlist2.id,
        submission_id: sub3.id
      }
    });

    console.log('✅ Films associés aux playlists');
    console.log('\n✨ Données de test créées avec succès!');
    console.log('Vous pouvez maintenant vous connecter avec jury@test.com');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

seedData();
