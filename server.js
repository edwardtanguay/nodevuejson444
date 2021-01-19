const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const flashcards = require("./src/data/flashcards.json")

const Flashcards = require('./src/itemTypes/flashcards');

const app = express();
const port = 3001;



app.use(bodyParser.urlencoded({
	limit: '200mb', extended: true
}));
app.use(bodyParser.json({ limit: '200mb' }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './public/pages'));

const staticDirectory = path.join(__dirname, './public');
app.use(express.static(staticDirectory));

app.get('/', (req, res) => {
	res.render('index', { pageTitle: 'Flashcards' });
});

app.get('/test', (req, res) => {
	res.render('test', { pageTitle: 'Test Page' });
});

app.get('/siteData', (req, res) => {
	setTimeout(() => {
		res.send({ flashcards: flashcards });
	},2000);
});

app.post('/backend', async (req, res) => {
	const emulatedWaitSeconds = .2;

	const flashcards = new Flashcards();
	const data = {};

	switch (req.body.action) {
		case 'loadPageData':
			data.flashcards = await flashcards.getAll();
			data.categories = await flashcards.getCategories();
			break;
		case 'loadCategory':
			data.flashcards = await flashcards.getCategory(req.body.categoryName);
			break;
		case 'saveFlashcard':
			const f = req.body.flashcard;
			await flashcards.addEntry(f.category, f.front, f.back);
			data.success = true;
			break;
	}

	setTimeout(() => {
		res.send(JSON.stringify(data));
	}, emulatedWaitSeconds * 1000);
});

app.listen(port, () => {
	console.log('app running on port ' + port);
});

