import {
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import userService from "@/api/userService";
import { Delete } from "@mui/icons-material";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);

  const userServiceMemo = useMemo(() => userService(), []);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await userServiceMemo.handleGetAllUsers();
        console.log(response);
        setUsers(response);
      };
      fetchData();
    } catch (error) {
      console.error(error);
    }
    0;
  }, [userServiceMemo]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir este usuário?"
    );
    if (confirmDelete) {
      try {
        const response = await userServiceMemo.handleDeleteUserById(id);
        console.log(response);
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const getRoleStyle = (role) => {
    switch (role) {
      case "ADMIN":
        return "red";
      case "USER":
        return "blue";
      default:
        return {};
    }
  };

  return (
    <Stack
      marginTop={4}
      alignItems={"center"}
      justifyContent={"center"}
      spacing={2}
    >
      <Typography variant="h4">Usuários</Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell>Permissões</TableCell>
              <TableCell>Inscrições</TableCell>
              <TableCell>Opções</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Typography color={getRoleStyle(user.role)}>
                    {user.role}
                  </Typography>
                </TableCell>
                <TableCell>{user.registrations.length}</TableCell>
                <TableCell>
                  {user.role === "ADMIN" ? (
                    <IconButton disabled>
                      <Delete />
                    </IconButton>
                  ) : user.role === "USER" ? (
                    <Tooltip title="Excluir usuário" placement="left">
                      <IconButton onClick={() => handleDelete(user.id)}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default AdminPanel;
