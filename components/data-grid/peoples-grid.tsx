import { Link } from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';
import { PeopleType } from '../../types';
import Image from 'next/image';
import { Stack } from '@mui/material';
import { getRandomFace } from '../../utils';
import { GridColumns } from '@mui/x-data-grid';

const peoplesColumn: GridColumns = [
  {
    field: 'picture',
    headerName: 'picture',
    flex: 1,
    headerAlign: 'center',
    editable: false,
    width: 100,
    renderCell: (params: { row: PeopleType }) => {
      const { picture, name } = params.row;
      return (
        <Stack
          sx={{ width: '100%' }}
          justifyContent='center'
          alignItems='center'
        >
          <Image src={picture} alt={name} width={100} height={100} />
        </Stack>
      );
    }
  },
  {
    field: 'name',
    headerName: 'name',
    flex: 1,
    headerAlign: 'center',
    editable: false
  },
  {
    field: 'gender',
    headerName: 'gender',
    flex: 1,
    headerAlign: 'center',
    editable: false
  },
  {
    field: 'age',
    headerName: 'age',
    flex: 1,
    headerAlign: 'center',
    editable: false
  },
  {
    field: 'email',
    headerName: 'email',
    flex: 1,
    headerAlign: 'center',
    editable: false
  },
  {
    field: 'isActive',
    headerName: 'isActive',
    flex: 1,
    headerAlign: 'center',
    editable: false
  }
];

export default peoplesColumn;

// {
//     field: "language",
//     type: "actions",
//     headerName: "language",
//     hide: false,
//     width: 100,
//     headerAlign: "center",
//     editable: false,
//     //   getActions: (params: any) => {
//     //     const { row = {} } = params;
//     //     const { codeLanguage = "en", name } = row;

//     //     return [
//     //       <GridActionsCellItem
//     //         icon={
//     //           <CountryFlag
//     //             countryCode={codeLanguage === "en" ? "gb" : codeLanguage}
//     //             flagName={name}
//     //             size="medium"
//     //           />
//     //         }
//     //         label="language"
//     //       />,
//     //     ];
//     //   },
//   },
//   {
//     field: "actions",
//     type: "actions",
//     headerName: "actions",
//     width: 200,
//     sortable: false,
//     align: "center",
//     headerAlign: "center",
//     //   getActions: (params: any) => [
//     //     <GridActionsCellItem
//     //       icon={
//     //         <Link component={RouterLink} to={`/entities/${params.id}`}>
//     //           <VisibilityIcon />
//     //         </Link>
//     //       }
//     //       label="view"
//     //     />,
//     //   ],
//     editable: false,
//   },
