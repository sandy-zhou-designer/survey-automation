window.addEventListener('DOMContentLoaded', async () => {
	
	document.querySelector('#submit').onclick = async function (e) {
		e.preventDefault()
		waitOn()
		var content = {}
		var form = document.querySelector('form')
		var data = new FormData(form)

		console.log(data)

		for (var key of data.keys()) {
			if(key.includes('article-')) {
				content[key] = await getArticle(data.get(key), key)
				console.log(content[key])
			}
			else
				content[key] = data.get(key)
		}

		makeNewsletter(content)
	}
})

function waitOn() {
	document.querySelector('.spinner').className += ' wait'
}

function waitOff() {
	document.querySelector('.spinner').className = 'spinner'
}

async function makeNewsletter(c) {
	var template = await openTemplate('./templates/newsletter_stripped_template.html')
	const article = await openTemplate('./templates/article_stripped_template.html')
	const opinion = await openTemplate('./templates/opinion_stripped_template.html')
	var promo = await openTemplate('./templates/promo_template.html')
	let promoFlag = false

	for (var key in c) {

		if(key.includes('copy-'))
			template = template.replace((new RegExp('\{\{'+key+'\}\}',"g")), c[key])

		else if(key.includes('opinion')) 
			template = template.replace((new RegExp('\{\{'+key+'\}\}',"g")), opinionMake(c[key]))
		

		else if(key.includes('article-')){
			template = template.replace((new RegExp('\{\{'+key+'\}\}',"g")), articleMake(c[key]))
			console.log(key)
		}

		else if(key.includes('promo'))
			promoFlag = true
	}

	if(!promoFlag) template = template.replace('{{promo-area}}', '')
	else template = template.replace('{{promo-area}}', promoMake())

	waitOff()
	document.querySelector('#result').value = template
	document.querySelector('iframe').contentWindow.document.open()
	document.querySelector('iframe').contentWindow.document.write(template)

	function promoMake(post) {
		for (var key in c) 
			if(key.includes('copy-promo'))
				promo = promo.replace((new RegExp('\{\{'+key+'\}\}',"g")), c[key])

		return promo
	}

	function articleMake(post) {
		if(!post) return ''
		let a = article.replace((new RegExp('\{\{article-link\}\}',"g")), post.url)
		a = a.replace((new RegExp('\{\{article-title\}\}',"g")), post.title)
		a = a.replace((new RegExp('\{\{three_word_from_title\}\}',"g")), post.first_three_word)
		a = a.replace((new RegExp('\{\{date\}\}',"g")), getDate())
		return a.replace((new RegExp('\{\{article-img\}\}',"g")), post.img)
	}

	function opinionMake(post) {
		if(!post) return ''
		let a = opinion.replace((new RegExp('\{\{article-link\}\}',"g")), post.url)
		a = a.replace((new RegExp('\{\{article-title\}\}',"g")), post.title)
		a = a.replace((new RegExp('\{\{article-img\}\}',"g")), post.img)
		a = a.replace((new RegExp('\{\{three_word_from_title\}\}',"g")), post.first_three_word)
		a = a.replace((new RegExp('\{\{date\}\}',"g")), getDate())
		return a.replace((new RegExp('\{\{article-author\}\}',"g")), post.author)
	}

	function getDate(){
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();

		return yyyy + "-" + mm + "-" + dd
	}

	async function openTemplate(filepath) {
		// var reader = new XMLHttpRequest()
		// reader.open('get', filepath, false)
		// reader.send()
		// return reader.responseText

		let r = await fetch(filepath).then(response => response.text())
		return r
	}
}

async function getArticle(url, key) {
	if(!url) return null

	let dom = await getSourceAsDOM(url)

	let author = ''

	// IF EPOCH TV ARTICLE
	if(dom.querySelector('#video_poster')) {
		var img = dom.querySelector('#video_poster').getAttribute('data-poster')
		var title = dom.querySelector('.title').innerText
		var first_three_word = "TV_" + title.replace("’","").split(" ")[0] + "_" + title.replace("’","").split(" ")[1] + "_" + title.replace("’","").split(" ")[2]
	}

	else {

		//IF OPINION ARTICLE
		if(key.includes('opinion')) {
			var img = dom.querySelector('.author .avatar img').src
			author = dom.querySelector('.author .name').innerText
			var title = dom.querySelector('.title').innerText
			var first_three_word = "Op_CA_" + title.replace("’","").split(" ")[0] + "_" + title.replace("’","").split(" ")[1] + "_" + title.replace("’","").split(" ")[2]
		}

		//IF OTHER ARTICLE
		else
			var img = dom.querySelector('.featured_img img').src
		
		var title = dom.querySelector('.post_title h1').innerText
		var first_three_word = "News_" + title.replace("’","").split(" ")[0] + "_" + title.replace("’","").split(" ")[1] + "_" + title.replace("’","").split(" ")[2]
	}
		
	return {url, img, title, author, first_three_word}

	async function getSourceAsDOM(url) {
	    parser = new DOMParser()
	    let dom = await loadHTML(url)
	    return parser.parseFromString(dom,"text/html");     
	}
}

async function loadHTML(url) {
	let r = await fetch(url).then(response => response.text())
	return r
}