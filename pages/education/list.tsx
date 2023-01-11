import { useState } from 'react';
import {
	createStyles,
	Table,
	UnstyledButton,
	Group,
	Text,
	Center,
	TextInput,
	Badge,
} from '@mantine/core';
import { keys } from '@mantine/utils';
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch } from '@tabler/icons';
import { useDebouncedState } from '@mantine/hooks';

const useStyles = createStyles((theme) => ({
	th: {
		padding: '0 !important',
	},

	control: {
		width: '100%',
		padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

		'&:hover': {
			backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
		},
	},

	icon: {
		width: 21,
		height: 21,
		borderRadius: 21,
	},

	thead: {
		position: 'sticky',
		top: 45,
		background: 'white',
	},
}));

interface ThProps {
	children: React.ReactNode;
	reversed: boolean;
	sorted: boolean;
	onSort(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
	const { classes } = useStyles();
	const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
	return (
		<th className={classes.th}>
			<UnstyledButton onClick={onSort} className={classes.control}>
				<Group position="apart" noWrap>
					<Text weight={500} size="sm">
						{children}
					</Text>
					<Center className={classes.icon}>
						<Icon size={14} stroke={1.5} />
					</Center>
				</Group>
			</UnstyledButton>
		</th>
	);
}

function filterData(data: Record[], search: string) {
	const query = search.toLowerCase().trim();
	return data.filter((item) =>
		keys(data[0]).some((key) => new String(item[key]).toLowerCase().includes(query)),
	);
}

function sortData(
	data: Record[],
	payload: { sortBy: keyof Record | null; reversed: boolean; search: string },
) {
	const { sortBy } = payload;

	if (!sortBy) {
		return filterData(data, payload.search);
	}

	return filterData(
		[...data].sort((a, b) => {
			if (payload.reversed) {
				return b[sortBy].localeCompare(a[sortBy]);
			}

			return a[sortBy].localeCompare(b[sortBy]);
		}),
		payload.search,
	);
}

type Record = {
	'ID': '12522';
	"Прізвище та ім'я співробітник": 'Мішустін Назар';
	'Посада': 'Офіціант';
	'Ресторан': 'Межигірська 15/35д (Подол)';
	'Тема': 'Кава - від плантації до чашки';
	'Дата': '2023-01-16T22:00:00.000Z';
	'Присутність': 'Да' | 'Нет' | '';
};

export async function getServerSideProps() {
	const res = await fetch(
		'https://script.google.com/macros/s/AKfycbza2yNN2hhAGuvO-gGzgslzdS9niAelfIBjNn3Ljeu7G6Ip1bOOl2DSI5lB2Vs2fkVo/exec',
	);

	const elements: Record[] = await res.json();

	return {
		props: {
			elements,
		},
	};
}

function Page({ elements }: { elements: Record[] }) {
	const { classes } = useStyles();
	const [search, setSearch] = useDebouncedState('', 300);
	const [sortedData, setSortedData] = useDebouncedState(elements, 300);
	const [sortBy, setSortBy] = useState<keyof Record | null>(null);
	const [reverseSortDirection, setReverseSortDirection] = useState(false);

	const setSorting = (field: keyof Record) => {
		const reversed = field === sortBy ? !reverseSortDirection : false;
		setReverseSortDirection(reversed);
		setSortBy(field);
		setSortedData(sortData(elements, { sortBy: field, reversed, search }));
	};

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.currentTarget;

		setSearch(value);
		setSortedData(sortData(elements, { sortBy, reversed: reverseSortDirection, search: value }));
	};

	const rows = sortedData.map((element) => {
		let badge;
		if (element['Присутність'] === 'Да') {
			badge = <Badge color={'green'}>Так</Badge>;
		}
		if (element['Присутність'] === 'Нет') {
			badge = <Badge color={'red'}>Ні</Badge>;
		}
		if (element['Присутність'] === '') {
			badge = '';
		}
		return (
			<tr key={element['ID']}>
				<td>{element['Посада']}</td>
				<td>{element["Прізвище та ім'я співробітник"]}</td>
				<td>{element['Ресторан']}</td>
				<td>{element['Тема']}</td>
				<td>{new Date(element['Дата']).toLocaleDateString('uk-UA')}</td>
				<td>{badge}</td>
			</tr>
		);
	});

	return (
		<div>
			<TextInput
				placeholder="Пошук на будь-якому полі"
				p="5px"
				icon={<IconSearch size={14} stroke={1} />}
				onChange={handleSearchChange}
				sx={{ position: 'fixed', top: 0, width: '100vw', background: 'white' }}
			/>
			<Table
				horizontalSpacing="xs"
				verticalSpacing="xs"
				mt={45}
				sx={{ tableLayout: 'fixed', minWidth: 700 }}
			>
				<thead className={classes.thead}>
					<tr>
						<Th
							sorted={sortBy === 'Посада'}
							reversed={reverseSortDirection}
							onSort={() => setSorting('Посада')}
						>
							Посада
						</Th>
						<Th
							sorted={sortBy === "Прізвище та ім'я співробітник"}
							reversed={reverseSortDirection}
							onSort={() => setSorting("Прізвище та ім'я співробітник")}
						>
							ПІ
						</Th>
						<Th
							sorted={sortBy === 'Ресторан'}
							reversed={reverseSortDirection}
							onSort={() => setSorting('Ресторан')}
						>
							Ресторан
						</Th>
						<Th
							sorted={sortBy === 'Тема'}
							reversed={reverseSortDirection}
							onSort={() => setSorting('Тема')}
						>
							Тема
						</Th>
						<Th
							sorted={sortBy === 'Дата'}
							reversed={reverseSortDirection}
							onSort={() => setSorting('Дата')}
						>
							Дата
						</Th>
						<Th
							sorted={sortBy === 'Присутність'}
							reversed={reverseSortDirection}
							onSort={() => setSorting('Присутність')}
						>
							Присутність
						</Th>
					</tr>
				</thead>
				<tbody>
					{rows.length > 0 ? (
						rows
					) : (
						<tr>
							<td colSpan={Object.keys(elements[0]).length}>
								<Text weight={500} align="center">
									Нічого не знайдено
								</Text>
							</td>
						</tr>
					)}
				</tbody>
			</Table>
		</div>
	);
}

export default Page;
