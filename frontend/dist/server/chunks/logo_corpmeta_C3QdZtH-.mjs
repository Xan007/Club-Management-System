const logoClub = new Proxy({"src":"/_astro/logo_corpmeta.C8OX8TXH.png","width":425,"height":587,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/SSierra/Documents/DesarrolloClubElMeta/frontend/src/assets/logo_corpmeta.png";
							}
							
							return target[name];
						}
					});

export { logoClub as l };
