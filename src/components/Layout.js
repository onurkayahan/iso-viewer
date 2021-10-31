import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Masonry from '@mui/lab/Masonry';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { arrayBufferToString, hexStringToByteArray, hexaDecimalToDecimal, hexToAscii, buf2hex } from "../utils/mp4ParserUtils"
import BoxesTreeView from './tree/BoxesTreeView';
import BoxDetailTable from './detail/BoxDetailTable';
import ImageListView from './image/ImageListView';

const TYPES = ["moof", "mfhd", "traf", "tfhd", "trun", "uuid", "mdat"];
const PARENT_TYPES = ["moof", "traf"];

const Item = styled(Paper)(({ theme }) => ({
	...theme.typography.body2,
	color: theme.palette.text.secondary,
	border: '1px solid black',
	padding: "2rem"
}));
export default function Layout() {

	const [boxes, setBoxes] = useState([]);
	const [images, setImages] = useState([]);
	const [selectedBox, setSelectedBox] = useState(null);

	useEffect(() => {
		load();
	}, []);

	const load = async () => {
		return fetch('http://demo.castlabs.com/tmp/text0.mp4')
			.then(response => {
				return response.arrayBuffer()
					.then(arrayBuffer => {
						let buffer = new Uint8Array(arrayBuffer);
						let hexArray = buf2hex(buffer);

						let boxArray = getBoxesRecursively(hexArray)
						setBoxes(boxArray);

						let imageArray = getImages(arrayBuffer);
						setImages(imageArray);
					})
					.catch(err => {
						console.log("Error occured while get arrayBuffer from response. Error: ", err)
					});
			})
			.catch(err => {
				console.log("Error occured on request. Error: ", err)
			});
	}

	function getBoxesRecursively(hexArray) {
		let parsedBoxes = [];

		let counter = 0;

		let sizeHex = "";
		let typeHex = "";
		let dataHex = "";

		let size, type, data;

		for (let hex of hexArray) {
			if (counter >= 0 && counter <= 3) {
				sizeHex += hex;
				counter++;
			} else if (counter >= 4 && counter <= 7) {
				typeHex += hex;
				counter++;
			} else {
				dataHex += hex;
				if (counter === 8) {
					size = hexaDecimalToDecimal(sizeHex);
					type = hexToAscii(typeHex);
				}
				counter++;

				if (counter === size) {
					if (TYPES.includes(type)) {

						let box = new Map();
						box.set("size", size);
						box.set("type", type);


						if (PARENT_TYPES.includes(type)) {
							data = hexStringToByteArray(dataHex);
							let children = getBoxesRecursively(data);
							box.set("children", children)
						}

						let dateNow = new Date()
						console.log(`${dateNow} Found box of type ${type} and size ${size}`)
						if (type === "mdat") {
							console.log(`${dateNow} Content of mdat box is: ${hexToAscii(dataHex)}`);
						}

						parsedBoxes.push(box);
					}

					counter = 0;
					typeHex = sizeHex = dataHex = "";
				}
			}
		}

		return parsedBoxes;
	}

	function getImages(arrayBuffer) {
		let parsedImages = [];

		arrayBufferToString(arrayBuffer, "UTF8", (body) => {

			if (body) {
				let parts = body.split("<?xml");

				if (!parts[1]) {
					return;
				}

				let xml = "<?xml" + parts[1];

				let parser, xmlDoc;

				parser = new DOMParser();
				xmlDoc = parser.parseFromString(xml, "text/xml");

				let imageElements = xmlDoc.getElementsByTagName("smpte:image");

				Object.values(imageElements).forEach((imageElement) => {
					let elementAttributes = imageElement.childNodes[0].parentElement.attributes;

					//get element attributes from image
					let imageAttributes = Object.assign({},
						...Array.from(elementAttributes, ({ name, value }) => ({ [name]: value }))
					);

					//merge with base64 encoded string with attributes and create image object
					let parsedImage = { nodeValue: imageElement.childNodes[0].nodeValue, ...imageAttributes };

					parsedImages.push(parsedImage);
				})
			}
		})

		return parsedImages;
	}



	function handleTreeNodeClick(box) {
		if (box) {
			setSelectedBox(box);
		}
	}

	return (
		<Box sx={{ width: 1000, minHeight: 500 }}>
			<Masonry columns={2} spacing={1}>
				<Item sx={{ width: 500, height: 500 }}>
					<BoxesTreeView boxes={boxes} handleTreeNodeClick={handleTreeNodeClick} />
				</Item>
				<Item sx={{ width: 500, height: 246 }}>
					<BoxDetailTable box={selectedBox} />
				</Item>
				<Item sx={{ width: 500, height: 246 }}>
					{
						selectedBox && selectedBox.get("type") === "mdat" &&
						(
							<ImageListView images={images} />
						)
					}
				</Item>
			</Masonry>
		</Box>

	);
}
