const millanuraImg = new Proxy({"src":"/_astro/millanura.BbpMHCtF.jpg","width":1600,"height":900,"format":"jpg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/SSierra/Documents/DesarrolloClubElMeta/frontend/src/assets/millanura.jpg";
							}
							
							return target[name];
						}
					});

const barImg = new Proxy({"src":"/_astro/bar.CTVT5oWx.jpg","width":1086,"height":1448,"format":"jpg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/SSierra/Documents/DesarrolloClubElMeta/frontend/src/assets/bar.jpg";
							}
							
							return target[name];
						}
					});

const empresarialImg = new Proxy({"src":"/_astro/empresarial.02G5Lnxl.jpg","width":1200,"height":1600,"format":"jpg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/SSierra/Documents/DesarrolloClubElMeta/frontend/src/assets/empresarial.jpg";
							}
							
							return target[name];
						}
					});

const terrazaImg = new Proxy({"src":"/_astro/terraza.C75resU0.jpg","width":1600,"height":1200,"format":"jpg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/SSierra/Documents/DesarrolloClubElMeta/frontend/src/assets/terraza.jpg";
							}
							
							return target[name];
						}
					});

const kioskoImg = new Proxy({"src":"/_astro/kiosko.pcdOycul.jpg","width":2048,"height":2048,"format":"jpg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/SSierra/Documents/DesarrolloClubElMeta/frontend/src/assets/kiosko.jpg";
							}
							
							return target[name];
						}
					});

const presidencialImg = new Proxy({"src":"/_astro/presidencial.B2VXJPTj.jpg","width":1200,"height":1600,"format":"jpg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "C:/Users/SSierra/Documents/DesarrolloClubElMeta/frontend/src/assets/presidencial.jpg";
							}
							
							return target[name];
						}
					});

export { barImg as b, empresarialImg as e, kioskoImg as k, millanuraImg as m, presidencialImg as p, terrazaImg as t };
