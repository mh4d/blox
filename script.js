let robloxUsername = document.getElementById("roblox-username")

			let searchQuery = document.getElementById("search-query")			let output = document.getElementById("output")

			function getUrl() {

				let url = "blox.pages.dev"

				if (robloxUsername.value.length > 0) {

					url += `/${encodeURIComponent(robloxUsername.value)}`

				} else {

					return "Please enter username"

				}

				if (searchQuery.value.length > 0) {

					url += `/${encodeURIComponent(searchQuery.value.replace(" ", "-"))}`

				}

				return url

			}

			function update() {

				output.innerText = getUrl()

			}

			update()

			robloxUsername.addEventListener("change", update)

			searchQuery.addEventListener("change", update)
