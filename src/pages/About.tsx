export default function About() {
  return (
    <section className="container mx-auto px-4 py-20 max-w-4xl">
      <h1 className="font-display text-4xl font-semibold text-center mb-12">À propos de Labelia</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Texte principal */}
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p className="text-lg">
            Créée par Eva Yeo, Labelia est une marque ivoirienne, basée en Côte d'Ivoire qui 
            propose des bijoux en acier inoxydable, ainsi que des bijoux haut de gamme en 
            diamant moissanite et argent pur, alliant élégance, brillance et durabilité.
          </p>
          
          <p className="text-lg">
            Nos créations sont pensées comme des cadeaux romantiques précieux, parfaits pour 
            sublimer chaque moment et chaque personne qui les porte.
          </p>
          
          <p className="text-lg">
            Chaque pièce raconte une histoire d'émotion, de passion et de luxe accessible, 
            tout en offrant une expérience unique, du choix à la réception.
          </p>
        </div>

        {/* Valeurs et visuel */}
        <div className="space-y-8">
          {/* Image placeholder */}
          <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-primary/20 rounded-sm flex items-center justify-center">
            <div className="text-center">
              <h2 className="font-display text-3xl font-semibold text-primary mb-2">Labelia</h2>
              <p className="text-muted-foreground">Le luxe de dire je t'aime...</p>
            </div>
          </div>

          {/* Nos valeurs */}
          <div className="bg-secondary/50 p-6 rounded-sm">
            <h3 className="font-display text-xl font-semibold text-foreground mb-4">Nos valeurs</h3>
            <ul className="space-y-3">
              {[
                "Élégance et brillance dans chaque création",
                "Qualité des matériaux : acier inoxydable, diamant moissanite, argent pur",
                "Designs romantiques pour des moments précieux",
                "Luxe accessible à toutes les femmes",
                "Expérience unique du choix à la réception",
                "Artisanat ivoirien avec passion",
              ].map((valeur) => (
                <li key={valeur} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">{valeur}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
