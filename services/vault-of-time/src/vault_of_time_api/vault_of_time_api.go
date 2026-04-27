package vault_of_time_api

import (
	"encoding/json"
	"net/http"
)

type HistoricalEvent struct {
	Name  string `json:"name"`
	Event string `json:"event"`
}

// historicalEventsHandler godoc
// @Summary      List historical events
// @Description  Returns a list of fictional and real historical events
// @Tags         events
// @Produce      json
// @Success      200  {array}  HistoricalEvent
// @Router       /historical-events [get]
func HistoricalEventsHandler(w http.ResponseWriter, r *http.Request) {
	events := []HistoricalEvent{
		{"Freddie Mercury", "Performed at Live Aid in 1985, one of the greatest rock performances in history."},
		{"Pikachu", "First appeared in Pokémon Red and Green in 1996."},
		{"Yoda", "Trained generations of Jedi before passing into the Force on Dagobah."},
		{"Ada Lovelace", "Wrote the first algorithm intended for a machine in the 1840s."},
		{"Julia Child", "Published 'Mastering the Art of French Cooking' in 1961."},
		{"Ellen Ripley (Alien series)", "Battled the Xenomorph aboard the Nostromo in 2122."},
		{"Doc Brown (Back to the Future)", "Invented the DeLorean time machine in 1985."},
		{"Alan Turing", "Broke the Enigma code during WWII."},
		{"Margaret Hamilton", "Led the software engineering team for the Apollo 11 mission."},
		{"Hypatia of Alexandria", "Taught philosophy and astronomy in 4th-century Alexandria."},
		{"R2 -D2 (Star Wars)", "Delivered the Death Star plans to the Rebellion."},
		{"Groot (Guardians of the Galaxy)", "Sacrificed himself to save the Guardians."},
		{"The Cheshire Cat (Alice in Wonderland)", "Guided Alice with cryptic wisdom in Wonderland."},
		{"Miss Piggy (The Muppets)", "Starred on The Muppet Show and became a cultural icon."},
		{"Han Solo (Star Wars)", "Helped destroy the Death Star and rescue Princess Leia."},
		{"Spock (Star Trek)", "Saved the Enterprise crew during the Genesis mission."},
		{"Trinity (The Matrix)", "Helped Neo awaken to his role as The One."},
		{"Agatha Christie", "Published 'Murder on the Orient Express' in 1934."},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(events)
}
