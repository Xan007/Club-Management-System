const heroBackground = new Proxy({"src":"/_astro/fondoclub.C9NBFriN.png","width":2048,"height":1152,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/SSierra/Documents/DesarrolloClubElMeta/frontend/src/assets/fondoclub.png";
							}
							
							return target[name];
						}
					});

export { heroBackground as h };
