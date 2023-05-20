const baseUrl = "https://www.roblox.com/users/profile?username="



async function constructRedirectUrl(data) {

	const parameters = {

		Category: 13, // Community Creations

		Subcategory: 40, // All Creations

	}

	if (data.creatorName) {

		const alias = aliases[data.creatorName]

		if (alias) {

			if (typeof alias === "string") {

				data.creatorName = alias

			}

			data = { ...data, ...alias }

		}

		// Use current username for catalog CreatorName key

		try {

			const res = await fetch(`https://api.roblox.com/users/get-by-username?username=${data.creatorName}`)

			const json = await res.json();

			data.creatorName = json.Username || data.creatorName;

		} catch (err) {

			// Default to provided creatorName if upstream API

			console.error(`Failed username lookup for '${data.creatorName}': ${err}`)

		}

		parameters.CreatorName = data.creatorName

	}

	if (data.searchQuery) {

		parameters.Keyword = data.searchQuery.replace("-", " ")

	}

	if (data.sort && sortTypes[data.sort]) {

		parameters.SortType = sortTypes[data.sort]

	}

	if (data.sortAggregation && sortAggregations[data.sortAggregation]) {

		parameters.SortAggregation = sortAggregations[data.sortAggregation]

	}

	const query = new URLSearchParams(parameters)

	return `${baseUrl}?${query.toString()}`

}

function getUrlData(url) {

	const pathname = (new URL(url)).pathname

	

	const pattern = patterns.find((pattern) => {

		return !!pattern.regex.test(pathname)

	})

	if (pattern) {

		const data = {}

		const match = pathname.match(pattern.regex)

		pattern.captures.forEach((capture, index) => {

			const value = match[index + 1].toLowerCase()

			if (value.length > 0) {

				data[capture] = value

			}

		})

		return data

	} else {

		return null

	}

}

async function handleRequest(request) {

	const data = getUrlData(request.url)

	if (!data) {

		return new Response(`Unknown match for url "${request.url}"`, {

			status: 401,

		})

	}

	const redirect = await constructRedirectUrl(data)

	const headers = new Headers()

	headers.append("Location", redirect)

	return new Response("", {

		status: 307,

		headers: headers,

	})

}

addEventListener("fetch", (event) => {

	event.respondWith(handleRequest(event.request))

})
