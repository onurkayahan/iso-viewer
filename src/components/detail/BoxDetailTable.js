import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles'

const VISIBLE_HEADERS = ["size", "type"];

export const useStyles = makeStyles(() => ({
   tableHeader: {
      backgroundColor: '#AAAAAA'
   }
}))

export default function BoxDetailTable(props) {
   const [selectedBox, setSelectedBox] = useState(null);

   const classes = useStyles();

   useEffect(() => {
      if (props.box) {
         let box = Array.from(props.box, ([key, value]) => {
            return {
               key,
               value
            }
         })
         setSelectedBox(box);
      }
   }, [props.box])

   const isValidHeader = (header) => {
      return VISIBLE_HEADERS.includes(header);
   }

   return (
      props.box && <TableContainer component={Paper}>
         <Table sx={{ minWidth: 250 }} aria-label="image headers">
            <TableHead className={classes.tableHeader}>
               <TableRow>
                  <TableCell align="center">Property</TableCell>
                  <TableCell align="center">Value</TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {selectedBox && selectedBox.map((attribute, index) =>
                  isValidHeader(attribute.key) && (
                     <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                     >
                        <TableCell align="center" component="th" scope="row">
                           {attribute.key}
                        </TableCell>
                        <TableCell align="center">{attribute.value}</TableCell>

                     </TableRow>
                  ))}
            </TableBody>
         </Table>
      </TableContainer>
   );
}